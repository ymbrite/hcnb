export default defineEventHandler(async (event) => {
  const { serverQueryContent } = await import('#content/server')

  // 獲取最新的 20 篇文章
  const articles = await serverQueryContent(event, 'blog')
    .where({ _draft: { $ne: true } })
    .sort({ publishedAt: -1 })
    .limit(20)
    .find()

  const siteUrl = 'https://your-blog-site.com' // 替換為實際網站 URL
  const siteName = 'Markdown Blog Site'
  const siteDescription = '一個基於 Nuxt v4 和 Markdown 的現代部落格網站'
  const currentDate = new Date().toUTCString()

  // 生成 RSS XML
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>${siteDescription}</description>
    <language>zh-TW</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>${siteName}</title>
      <link>${siteUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    
    ${articles
      .map((article) => {
        const articleUrl = `${siteUrl}${article._path}`
        const pubDate = new Date(article.publishedAt).toUTCString()
        const description = escapeXml(article.description || '')
        const content = escapeXml(
          article.body?.children
            ?.map((child: any) => extractTextFromNode(child))
            .join(' ')
            .substring(0, 500) + '...' || '',
        )

        return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${description}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@${new URL(siteUrl).hostname} (${escapeXml(article.author || '匿名作者')})</author>
      <category>${escapeXml(article.category || '')}</category>
      ${(article.tags || []).map((tag: string) => `<category>${escapeXml(tag)}</category>`).join('')}
      ${article.image ? `<enclosure url="${siteUrl}${article.image}" type="image/jpeg"/>` : ''}
    </item>`
      })
      .join('')}
  </channel>
</rss>`

  // 設定回應標頭
  setHeader(event, 'Content-Type', 'application/rss+xml')
  setHeader(event, 'Cache-Control', 'max-age=3600') // 快取 1 小時

  return rss
})

/**
 * 轉義 XML 特殊字符
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 從內容節點中提取純文字
 */
function extractTextFromNode(node: any): string {
  if (typeof node === 'string') {
    return node
  }

  if (node.type === 'text') {
    return node.value || ''
  }

  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractTextFromNode).join(' ')
  }

  return ''
}
