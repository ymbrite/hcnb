import type { BlogArticle, Category, Tag, PaginationData } from '~/types/blog'

export const useBlog = () => {
  /**
   * 獲取所有已發布的文章
   */
  const getPublishedArticles = async () => {
    try {
      const articles = await queryContent('blog')
        .where({ draft: { $ne: true } })
        .sort({ publishedAt: -1 })
        .find()

      return articles as BlogArticle[]
    } catch (error) {
      console.error('Error fetching published articles:', error)
      return []
    }
  }

  /**
   * 獲取精選文章
   */
  const getFeaturedArticles = async (limit: number = 3) => {
    try {
      const articles = await queryContent('blog')
        .where({
          draft: { $ne: true },
          featured: true,
        })
        .sort({ publishedAt: -1 })
        .limit(limit)
        .find()

      return articles as BlogArticle[]
    } catch (error) {
      console.error('Error fetching featured articles:', error)
      return []
    }
  }

  /**
   * 獲取最新文章
   */
  const getRecentArticles = async (limit: number = 5) => {
    try {
      const articles = await queryContent('blog')
        .where({ draft: { $ne: true } })
        .sort({ publishedAt: -1 })
        .limit(limit)
        .find()

      return articles as BlogArticle[]
    } catch (error) {
      console.error('Error fetching recent articles:', error)
      return []
    }
  }

  /**
   * 根據分類獲取文章
   */
  const getArticlesByCategory = async (category: string) => {
    try {
      const articles = await queryContent('blog')
        .where({
          draft: { $ne: true },
          category: category,
        })
        .sort({ publishedAt: -1 })
        .find()

      return articles as BlogArticle[]
    } catch (error) {
      console.error('Error fetching articles by category:', error)
      return []
    }
  }

  /**
   * 根據標籤獲取文章
   */
  const getArticlesByTag = async (tag: string) => {
    try {
      const articles = await queryContent('blog')
        .where({
          draft: { $ne: true },
          tags: { $contains: tag },
        })
        .sort({ publishedAt: -1 })
        .find()

      return articles as BlogArticle[]
    } catch (error) {
      console.error('Error fetching articles by tag:', error)
      return []
    }
  }

  /**
   * 獲取單篇文章
   */
  const getArticleBySlug = async (slug: string) => {
    try {
      const article = await queryContent('blog', slug).findOne()
      return article as BlogArticle
    } catch (error) {
      console.error('Error fetching article by slug:', error)
      return null
    }
  }

  /**
   * 獲取所有分類
   */
  const getCategories = async (): Promise<Category[]> => {
    try {
      const articles = await getPublishedArticles()
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
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  /**
   * 獲取所有標籤
   */
  const getTags = async (): Promise<Tag[]> => {
    try {
      const articles = await getPublishedArticles()
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
    } catch (error) {
      console.error('Error fetching tags:', error)
      return []
    }
  }

  /**
   * 分頁獲取文章
   */
  const getPaginatedArticles = async (
    page: number = 1,
    pageSize: number = 10,
    category?: string,
    tag?: string,
  ): Promise<PaginationData<BlogArticle>> => {
    try {
      let query = queryContent('blog').where({ draft: { $ne: true } })

      if (category) {
        query = query.where({ category })
      }

      if (tag) {
        query = query.where({ tags: { $contains: tag } })
      }

      const total = await query.count()
      const articles = await query
        .sort({ publishedAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .find()

      const totalPages = Math.ceil(total / pageSize)

      return {
        data: articles as BlogArticle[],
        pagination: {
          page,
          pageSize,
          pageCount: totalPages,
          total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      }
    } catch (error) {
      console.error('Error fetching paginated articles:', error)
      return {
        data: [],
        pagination: {
          page: 1,
          pageSize,
          pageCount: 0,
          total: 0,
          hasNext: false,
          hasPrev: false,
        },
      }
    }
  }

  /**
   * 搜尋文章
   */
  const searchArticles = async (searchTerm: string): Promise<BlogArticle[]> => {
    try {
      const articles = await queryContent('blog')
        .where({
          draft: { $ne: true },
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { tags: { $contains: searchTerm } },
            { category: { $regex: searchTerm, $options: 'i' } },
          ],
        })
        .sort({ publishedAt: -1 })
        .find()

      return articles as BlogArticle[]
    } catch (error) {
      console.error('Error searching articles:', error)
      return []
    }
  }

  return {
    getPublishedArticles,
    getFeaturedArticles,
    getRecentArticles,
    getArticlesByCategory,
    getArticlesByTag,
    getArticleBySlug,
    getCategories,
    getTags,
    getPaginatedArticles,
    searchArticles,
  }
}
