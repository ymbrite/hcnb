export const useContentUtils = () => {
  /**
   * 處理內容載入錯誤
   */
  const handleContentError = (error: any, fallback?: any) => {
    console.error('Content loading error:', error)

    if (process.client) {
      // 客戶端錯誤處理
      navigateTo('/404')
    }

    return fallback || null
  }

  /**
   * 安全地獲取內容，包含錯誤處理
   */
  const safeQueryContent = async <T = any>(path: string, options?: any): Promise<{ data: T | null; error: any }> => {
    try {
      const data = await queryContent(path, options).findOne()
      return { data: data as T, error: null }
    } catch (error) {
      console.error(`Error querying content at path: ${path}`, error)
      return { data: null, error }
    }
  }

  /**
   * 安全地獲取多個內容項目
   */
  const safeQueryContentList = async <T = any>(path: string, options?: any): Promise<{ data: T[]; error: any }> => {
    try {
      const data = await queryContent(path, options).find()
      return { data: data as T[], error: null }
    } catch (error) {
      console.error(`Error querying content list at path: ${path}`, error)
      return { data: [], error }
    }
  }

  /**
   * 帶有載入狀態的內容獲取
   */
  const useContentWithLoading = async <T = any>(key: string, fetcher: () => Promise<T>) => {
    const loading = ref(true)
    const error = ref<any>(null)
    const data = ref<T | null>(null)

    try {
      data.value = await fetcher()
    } catch (err) {
      error.value = err
      console.error(`Error in useContentWithLoading for key: ${key}`, err)
    } finally {
      loading.value = false
    }

    return {
      data: readonly(data),
      loading: readonly(loading),
      error: readonly(error),
    }
  }

  /**
   * 重試機制
   */
  const withRetry = async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
  ): Promise<T> => {
    let lastError: any

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        console.warn(`Attempt ${attempt} failed:`, error)

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay * attempt))
        }
      }
    }

    throw lastError
  }

  /**
   * 驗證內容結構
   */
  const validateContent = (content: any, requiredFields: string[]): boolean => {
    if (!content) {
      console.warn('Content is null or undefined')
      return false
    }

    for (const field of requiredFields) {
      if (!content[field]) {
        console.warn(`Missing required field: ${field}`)
        return false
      }
    }

    return true
  }

  /**
   * 格式化內容錯誤訊息
   */
  const formatErrorMessage = (error: any): string => {
    if (error?.statusCode === 404) {
      return '內容不存在'
    }

    if (error?.statusCode === 500) {
      return '伺服器錯誤，請稍後再試'
    }

    if (error?.message) {
      return error.message
    }

    return '載入內容時發生未知錯誤'
  }

  /**
   * 檢查內容是否已發布
   */
  const isContentPublished = (content: any): boolean => {
    if (!content) return false

    // 檢查是否為草稿
    if (content.draft === true) return false

    // 檢查發布日期
    if (content.publishedAt) {
      const publishDate = new Date(content.publishedAt)
      const now = new Date()
      return publishDate <= now
    }

    return true
  }

  /**
   * 獲取內容摘要
   */
  const getContentExcerpt = (content: any, maxLength: number = 150): string => {
    if (!content) return ''

    // 優先使用 description
    if (content.description) {
      return content.description.length > maxLength
        ? content.description.substring(0, maxLength) + '...'
        : content.description
    }

    // 從內容中提取摘要
    if (content.body) {
      const textContent = extractTextFromBody(content.body)
      return textContent.length > maxLength ? textContent.substring(0, maxLength) + '...' : textContent
    }

    return ''
  }

  /**
   * 從內容 body 中提取純文字
   */
  const extractTextFromBody = (body: any): string => {
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

  return {
    handleContentError,
    safeQueryContent,
    safeQueryContentList,
    useContentWithLoading,
    withRetry,
    validateContent,
    formatErrorMessage,
    isContentPublished,
    getContentExcerpt,
    extractTextFromBody,
  }
}
