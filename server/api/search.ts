export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const searchTerm = query.q as string

  // 驗證搜尋參數
  if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length === 0) {
    return {
      results: [],
      total: 0,
      query: '',
      message: '請輸入搜尋關鍵字',
    }
  }

  const cleanSearchTerm = searchTerm.trim().toLowerCase()

  try {
    // 查詢所有已發布的文章
    const allArticles = (await $fetch('/api/_content/query', {
      method: 'GET',
      query: {
        where: JSON.stringify([{ draft: { $ne: true } }]),
        sort: JSON.stringify([{ publishedAt: -1 }]),
      },
    })) as any[]

    // 搜尋邏輯
    const searchResults = allArticles.filter((article) => {
      // 搜尋標題
      if (article.title && article.title.toLowerCase().includes(cleanSearchTerm)) {
        return true
      }

      // 搜尋描述
      if (article.description && article.description.toLowerCase().includes(cleanSearchTerm)) {
        return true
      }

      // 搜尋分類
      if (article.category && article.category.toLowerCase().includes(cleanSearchTerm)) {
        return true
      }

      // 搜尋標籤
      if (article.tags && Array.isArray(article.tags)) {
        return article.tags.some((tag) => tag.toLowerCase().includes(cleanSearchTerm))
      }

      // 搜尋內容（如果有 body）
      if (article.body && typeof article.body === 'object') {
        const textContent = extractTextFromBody(article.body)
        if (textContent.toLowerCase().includes(cleanSearchTerm)) {
          return true
        }
      }

      return false
    })

    // 計算相關性分數並排序
    const scoredResults = searchResults
      .map((article) => {
        let score = 0
        const titleMatch = article.title?.toLowerCase().includes(cleanSearchTerm)
        const descriptionMatch = article.description?.toLowerCase().includes(cleanSearchTerm)
        const categoryMatch = article.category?.toLowerCase().includes(cleanSearchTerm)
        const tagMatch = article.tags?.some((tag: string) => tag.toLowerCase().includes(cleanSearchTerm))

        // 權重計算
        if (titleMatch) score += 10
        if (descriptionMatch) score += 5
        if (categoryMatch) score += 3
        if (tagMatch) score += 2

        // 完全匹配加分
        if (article.title?.toLowerCase() === cleanSearchTerm) score += 20
        if (article.category?.toLowerCase() === cleanSearchTerm) score += 15

        return {
          ...article,
          searchScore: score,
          matchedFields: {
            title: titleMatch,
            description: descriptionMatch,
            category: categoryMatch,
            tags: tagMatch,
          },
        }
      })
      .sort((a, b) => b.searchScore - a.searchScore)

    // 限制結果數量
    const maxResults = parseInt(query.limit as string) || 20
    const limitedResults = scoredResults.slice(0, maxResults)

    return {
      results: limitedResults,
      total: searchResults.length,
      query: searchTerm,
      message: searchResults.length > 0 ? `找到 ${searchResults.length} 篇相關文章` : '沒有找到相關文章',
    }
  } catch (error) {
    console.error('Search API error:', error)

    return {
      results: [],
      total: 0,
      query: searchTerm,
      message: '搜尋時發生錯誤，請稍後再試',
      error: process.dev ? error.message : undefined,
    }
  }
})

// 從內容 body 中提取純文字的輔助函數
function extractTextFromBody(body: any): string {
  if (!body) return ''

  if (typeof body === 'string') {
    return body.replace(/<[^>]*>/g, '').trim()
  }

  if (body.children && Array.isArray(body.children)) {
    return body.children
      .map((child: any) => extractTextFromBody(child))
      .join(' ')
      .trim()
  }

  if (body.value) {
    return body.value.toString().trim()
  }

  return ''
}
