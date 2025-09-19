export default defineEventHandler(async (event) => {
  const { serverQueryContent } = await import('#content/server')

  // 獲取所有文章
  const articles = await serverQueryContent(event, 'blog')
    .where({ _draft: { $ne: true } })
    .sort({ publishedAt: -1 })
    .find()

  // 獲取所有分類
  const categories = [...new Set(articles.map((article) => article.category).filter(Boolean))]

  // 獲取所有標籤
  const tags = [...new Set(articles.flatMap((article) => article.tags || []))]

  const siteUrl = 'https://your-blog-site.com' // 替換為實際網站 URL
  const currentDate = new Date().toISOString()

  // 生成 sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首頁 -->
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- 部落格首頁 -->
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- 搜尋頁面 -->
  <url>
    <loc>${siteUrl}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- 分類索引頁 -->
  <url>
    <loc>${siteUrl}/blog/category</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 標籤索引頁 -->
  <url>
    <loc>${siteUrl}/blog/tag</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 文章頁面 -->
  ${articles
    .map(
      (article) => `
  <url>
    <loc>${siteUrl}${article._path}</loc>
    <lastmod>${article.updatedAt || article.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`,
    )
    .join('')}
  
  <!-- 分類頁面 -->
  ${categories
    .map(
      (category) => `
  <url>
    <loc>${siteUrl}/blog/category/${slugify(category)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`,
    )
    .join('')}
  
  <!-- 標籤頁面 -->
  ${tags
    .map(
      (tag) => `
  <url>
    <loc>${siteUrl}/blog/tag/${slugify(tag)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`,
    )
    .join('')}
</urlset>`

  // 設定回應標頭
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'max-age=3600') // 快取 1 小時

  return sitemap
})

/**
 * 將字串轉換為 URL 友善的 slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 將空格和底線轉換為連字號
    .replace(/^-+|-+$/g, '') // 移除開頭和結尾的連字號
}
