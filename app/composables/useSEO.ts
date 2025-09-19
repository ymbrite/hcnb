import type { BlogArticle } from '~/types/blog'

export const useSEO = () => {
  const config = useRuntimeConfig()
  const siteUrl: string = (config.public?.siteUrl as string) || 'http://localhost:3000'
  const siteName: string = 'Markdown 部落格'

  /**
   * 設定文章頁面的 SEO meta
   */
  const setArticleMeta = (article: BlogArticle) => {
    const url = `${siteUrl}${article._path}`
    const imageUrl = article.image ? `${siteUrl}${article.image}` : undefined

    useSeoMeta({
      title: article.title,
      description: article.description,
      ogTitle: article.title,
      ogDescription: article.description,
      ogImage: imageUrl,
      ogUrl: url,
      ogType: 'article',
      ogSiteName: siteName,
      twitterCard: 'summary_large_image',
      twitterTitle: article.title,
      twitterDescription: article.description,
      twitterImage: imageUrl,
      articlePublishedTime: article.publishedAt,
      articleModifiedTime: article.updatedAt || article.publishedAt,
      articleAuthor: article.author ? [article.author] : undefined,
      articleTag: article.tags,
      articleSection: article.category,
    })

    // 設定結構化資料 (JSON-LD)
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.description,
            image: imageUrl,
            url: url,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt || article.publishedAt,
            author: {
              '@type': 'Person',
              name: article.author || '匿名作者',
            },
            publisher: {
              '@type': 'Organization',
              name: siteName,
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/logo.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': url,
            },
            keywords: article.tags?.join(', '),
            articleSection: article.category,
          }),
        },
      ],
    })
  }

  /**
   * 設定頁面的 SEO meta
   */
  const setPageMeta = (title: string, description: string, path: string, image?: string) => {
    const url = `${siteUrl}${path}`
    const imageUrl = image ? `${siteUrl}${image}` : undefined

    useSeoMeta({
      title: `${title} - ${siteName}`,
      description,
      ogTitle: title,
      ogDescription: description,
      ogImage: imageUrl,
      ogUrl: url,
      ogType: 'website',
      ogSiteName: siteName,
      twitterCard: 'summary_large_image',
      twitterTitle: title,
      twitterDescription: description,
      twitterImage: imageUrl,
    })
  }

  /**
   * 設定首頁的 SEO meta
   */
  const setHomeMeta = () => {
    const title: string = '首頁'
    const description: string = '使用 Nuxt v4 建立的現代化 Markdown 部落格網站'

    useSeoMeta({
      title: `${title} - ${siteName}`,
      description: description,
      ogTitle: siteName,
      ogDescription: description,
      ogUrl: siteUrl,
      ogType: 'website',
      ogSiteName: siteName,
      twitterCard: 'summary_large_image',
      twitterTitle: siteName,
      twitterDescription: description,
    })

    // 設定網站結構化資料 (JSON-LD)
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteName,
            description,
            url: siteUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${siteUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        },
      ],
    })
  }

  /**
   * 設定部落格列表頁的 SEO meta
   */
  const setBlogListMeta = (page?: number) => {
    const title = page && page > 1 ? `所有文章 - 第 ${page} 頁` : '所有文章'
    const description = '瀏覽所有部落格文章，包含技術分享、教學指南等內容'

    setPageMeta(title, description, '/blog')
  }

  /**
   * 設定分類頁面的 SEO meta
   */
  const setCategoryMeta = (category: string, articleCount: number) => {
    const title = `${category} 分類`
    const description = `瀏覽 ${category} 分類下的所有文章，共 ${articleCount} 篇文章`

    setPageMeta(title, description, `/blog/category/${slugify(category)}`)
  }

  /**
   * 設定標籤頁面的 SEO meta
   */
  const setTagMeta = (tag: string, articleCount: number) => {
    const title = `${tag} 標籤`
    const description = `瀏覽包含 ${tag} 標籤的所有文章，共 ${articleCount} 篇文章`

    setPageMeta(title, description, `/blog/tag/${slugify(tag)}`)
  }

  /**
   * 生成麵包屑結構化資料
   */
  const setBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: item.name,
              item: `${siteUrl}${item.url}`,
            })),
          }),
        },
      ],
    })
  }

  /**
   * 生成關鍵字字串
   */
  const generateKeywords = (article: BlogArticle): string => {
    const keywords = [article.category, ...(article.tags || []), '部落格', 'Nuxt', 'Markdown']

    return keywords.filter(Boolean).join(', ')
  }

  /**
   * 清理和截斷描述文字
   */
  const sanitizeDescription = (text: string, maxLength: number = 160): string => {
    // 移除 HTML 標籤
    const cleanText = text.replace(/<[^>]*>/g, '')

    // 截斷文字
    if (cleanText.length <= maxLength) {
      return cleanText
    }

    return cleanText.substring(0, maxLength - 3).trim() + '...'
  }

  /**
   * 設定搜尋頁面的 SEO meta
   */
  const setSearchMeta = (query: string, resultCount: number) => {
    const title = query ? `搜尋結果：${query}` : '搜尋'
    const description = query
      ? `搜尋「${query}」的結果，找到 ${resultCount} 篇相關文章`
      : '搜尋部落格文章，找到您需要的內容'

    setPageMeta(title, description, query ? `/search?q=${encodeURIComponent(query)}` : '/search')
  }

  /**
   * 設定 404 頁面的 SEO meta
   */
  const setNotFoundMeta = () => {
    const title = '頁面未找到'
    const description = '抱歉，您要找的頁面不存在。請檢查網址或返回首頁瀏覽其他內容。'

    setPageMeta(title, description, '/404')
  }

  /**
   * 生成文章列表的結構化資料
   */
  const setArticleListSchema = (articles: BlogArticle[], listType: 'blog' | 'category' | 'tag' = 'blog') => {
    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: listType === 'blog' ? '部落格文章' : `${listType} 文章列表`,
            description: `${listType} 相關的文章列表`,
            numberOfItems: articles.length,
            itemListElement: articles.map((article, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'BlogPosting',
                '@id': `${siteUrl}${article._path}`,
                headline: article.title,
                description: article.description,
                datePublished: article.publishedAt,
                author: {
                  '@type': 'Person',
                  name: article.author || '匿名作者',
                },
                image: article.image ? `${siteUrl}${article.image}` : undefined,
              },
            })),
          }),
        },
      ],
    })
  }

  /**
   * 設定 canonical URL
   */
  const setCanonicalUrl = (path: string) => {
    useHead({
      link: [
        {
          rel: 'canonical',
          href: `${siteUrl}${path}`,
        },
      ],
    })
  }

  /**
   * 設定語言和地區
   */
  const setLanguage = (lang: string = 'zh-TW') => {
    useHead({
      htmlAttrs: {
        lang,
      },
    })
  }

  /**
   * 生成 Open Graph 圖片 URL
   */
  const generateOgImage = (title: string, category?: string): string => {
    const params = new URLSearchParams({
      title,
      ...(category && { category }),
    })

    return `${siteUrl}/api/og?${params.toString()}`
  }

  return {
    setArticleMeta,
    setPageMeta,
    setHomeMeta,
    setBlogListMeta,
    setCategoryMeta,
    setTagMeta,
    setSearchMeta,
    setNotFoundMeta,
    setBreadcrumbSchema,
    setArticleListSchema,
    setCanonicalUrl,
    setLanguage,
    generateKeywords,
    sanitizeDescription,
    generateOgImage,
  }
}
