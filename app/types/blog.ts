// 文章目錄項目
export interface TocItem {
  id: string
  depth: number
  text: string
  children?: TocItem[]
}

// 閱讀時間資訊
export interface ReadingTime {
  text: string
  minutes: number
  time: number
  words: number
}

// 部落格文章介面
export interface BlogArticle {
  _path: string
  _id: string
  _type: 'markdown'
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  category: string
  tags: string[]
  author?: string
  image?: string
  draft: boolean
  featured: boolean
  readingTime?: ReadingTime
  body: any // Nuxt Content parsed body
  toc?: TocItem[]
}

// 分類介面
export interface Category {
  name: string
  slug: string
  count: number
  description?: string
}

// 標籤介面
export interface Tag {
  name: string
  slug: string
  count: number
}

// 部落格元數據
export interface BlogMeta {
  totalArticles: number
  categories: Category[]
  tags: Tag[]
  recentArticles: BlogArticle[]
  featuredArticles: BlogArticle[]
}

// 分頁資料
export interface PaginationData<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// 文章卡片 Props
export interface ArticleCardProps {
  article: {
    _path: string
    title: string
    description: string
    publishedAt: string
    category: string
    tags: string[]
    image?: string
    readingTime?: ReadingTime
  }
  showExcerpt?: boolean
  showImage?: boolean
}

// 文章內容 Props
export interface ArticleContentProps {
  article: BlogArticle
  showToc?: boolean
}

// 分頁 Props
export interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  showFirstLast?: boolean
}
