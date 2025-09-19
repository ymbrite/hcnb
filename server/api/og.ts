export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const title = (query.title as string) || 'Markdown Blog Site'
  const category = (query.category as string) || ''

  // 這裡可以使用 @vercel/og 或其他圖片生成庫
  // 目前先返回一個簡單的 SVG 圖片
  const svg = generateOgSvg(title, category)

  setHeader(event, 'Content-Type', 'image/svg+xml')
  setHeader(event, 'Cache-Control', 'public, max-age=31536000') // 快取 1 年

  return svg
})

/**
 * 生成 Open Graph SVG 圖片
 */
function generateOgSvg(title: string, category: string): string {
  const maxTitleLength = 60
  const truncatedTitle = title.length > maxTitleLength ? title.substring(0, maxTitleLength - 3) + '...' : title

  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- 背景 -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- 裝飾圖案 -->
  <circle cx="1100" cy="100" r="80" fill="rgba(255,255,255,0.1)"/>
  <circle cx="100" cy="530" r="60" fill="rgba(255,255,255,0.1)"/>
  <circle cx="1050" cy="500" r="40" fill="rgba(255,255,255,0.1)"/>
  
  <!-- 網站名稱 -->
  <text x="60" y="80" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="rgba(255,255,255,0.9)">
    Markdown Blog Site
  </text>
  
  <!-- 分類標籤 -->
  ${
    category
      ? `
  <rect x="60" y="120" width="${category.length * 16 + 40}" height="40" rx="20" fill="rgba(255,255,255,0.2)"/>
  <text x="80" y="145" font-family="Arial, sans-serif" font-size="18" fill="white">
    ${escapeHtml(category)}
  </text>
  `
      : ''
  }
  
  <!-- 標題 -->
  <text x="60" y="${
    category ? '220' : '180'
  }" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">
    ${escapeHtml(truncatedTitle)}
  </text>
  
  <!-- 底部裝飾線 -->
  <rect x="60" y="550" width="200" height="4" fill="rgba(255,255,255,0.6)"/>
</svg>`.trim()
}

/**
 * 轉義 HTML 特殊字符
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
