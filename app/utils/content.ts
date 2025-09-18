import type { BlogArticle, Category, Tag } from '~/types/blog'

/**
 * 格式化日期
 */
export function formatDate(dateString: string, locale: string = 'zh-TW'): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 格式化相對時間
 */
export function formatRelativeTime(dateString: string, locale: string = 'zh-TW'): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second')
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month')
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year')
  }
}

/**
 * 從文章列表中提取所有分類
 */
export function extractCategories(articles: BlogArticle[]): Category[] {
  const categoryMap = new Map<string, number>()

  articles.forEach((article) => {
    if (article.category) {
      const count = categoryMap.get(article.category) || 0
      categoryMap.set(article.category, count + 1)
    }
  })

  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    slug: slugify(name),
    count,
  }))
}

/**
 * 從文章列表中提取所有標籤
 */
export function extractTags(articles: BlogArticle[]): Tag[] {
  const tagMap = new Map<string, number>()

  articles.forEach((article) => {
    if (article.tags) {
      article.tags.forEach((tag) => {
        const count = tagMap.get(tag) || 0
        tagMap.set(tag, count + 1)
      })
    }
  })

  return Array.from(tagMap.entries()).map(([name, count]) => ({
    name,
    slug: slugify(name),
    count,
  }))
}

/**
 * 將字串轉換為 URL 友善的 slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * 計算閱讀時間
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200,
): {
  text: string
  minutes: number
  time: number
  words: number
} {
  // 移除 HTML 標籤和 Markdown 語法
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`_~\[\]()]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')

  // 計算字數（中文字符和英文單詞）
  const chineseChars = (plainText.match(/[\u4e00-\u9fff]/g) || []).length
  const englishWords = (plainText.match(/[a-zA-Z]+/g) || []).length

  const totalWords = chineseChars + englishWords
  const minutes = Math.ceil(totalWords / wordsPerMinute)
  const time = minutes * 60 * 1000 // 轉換為毫秒

  return {
    text: `約 ${minutes} 分鐘閱讀`,
    minutes,
    time,
    words: totalWords,
  }
}

/**
 * 驗證 frontmatter 資料
 */
export function validateFrontmatter(data: any): boolean {
  const required = ['title', 'description', 'publishedAt', 'category']

  for (const field of required) {
    if (!data[field]) {
      console.warn(`Missing required field: ${field}`)
      return false
    }
  }

  // 驗證日期格式
  if (data.publishedAt && isNaN(Date.parse(data.publishedAt))) {
    console.warn('Invalid publishedAt date format')
    return false
  }

  if (data.updatedAt && isNaN(Date.parse(data.updatedAt))) {
    console.warn('Invalid updatedAt date format')
    return false
  }

  return true
}

/**
 * 過濾已發布的文章
 */
export function filterPublishedArticles(articles: BlogArticle[]): BlogArticle[] {
  return articles.filter((article) => !article.draft && new Date(article.publishedAt) <= new Date())
}

/**
 * 按日期排序文章
 */
export function sortArticlesByDate(articles: BlogArticle[], order: 'asc' | 'desc' = 'desc'): BlogArticle[] {
  return [...articles].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime()
    const dateB = new Date(b.publishedAt).getTime()
    return order === 'desc' ? dateB - dateA : dateA - dateB
  })
}
