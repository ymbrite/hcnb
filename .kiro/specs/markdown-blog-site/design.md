# Design Document

## Overview

這個 Markdown 部落格網站將使用 Nuxt v4 框架建構，採用現代化的全端架構。系統將利用 Nuxt Content 模組來處理 Markdown 檔案，並充分運用 Nuxt v4 的新特性，包括 Vite 6、Vue 3.5、以及改進的 Nitro 引擎。

核心設計原則：
- **效能優先**: 利用 Nuxt v4 的 Vite 6 和 Nitro 3 引擎優化
- **開發者體驗**: 使用 TypeScript、ESM-first 架構和改進的熱重載
- **內容管理**: 基於檔案系統的內容管理，支援 Git 工作流程
- **現代化**: 採用 Vue 3.5 的最新特性和 ESM 模組系統

## Architecture

### 系統架構圖

```mermaid
graph TB
    A[Markdown Files] --> B[@nuxt/content]
    B --> C[Content API]
    C --> D[Pages & Components]
    D --> E[Static Site Generation]
    E --> F[Deployed Website]
    
    G[Assets] --> H[Nuxt Image]
    H --> D
    
    I[Styling] --> J[Tailwind CSS]
    J --> D
    
    K[SEO Meta] --> L[Nuxt SEO]
    L --> D
```

### 技術堆疊

- **框架**: Nuxt v4 (基於 Vite 6 和 Nitro 3)
- **Vue 版本**: Vue 3.5 (支援新的響應式系統)
- **內容管理**: @nuxt/content v3 (與 Nuxt v4 相容)
- **樣式**: Tailwind CSS v4 (原生 CSS 支援)
- **圖片處理**: @nuxt/image v2
- **SEO**: @nuxt/seo v2
- **語法高亮**: Shiki v2 (內建於 @nuxt/content)
- **TypeScript**: 完整 TypeScript 5+ 支援
- **模組系統**: ESM-first 架構
- **部署**: 混合渲染模式 (SSR + SSG + SPA)

## Components and Interfaces

### 目錄結構 (遵循 Nuxt v4 指導原則)

```
project/
├── app/                          # Nuxt v4 新的 app 目錄結構
│   ├── assets/                   # 應用程式資源
│   │   └── css/
│   │       └── main.css
│   ├── components/               # Vue 組件
│   │   ├── Blog/
│   │   │   ├── ArticleCard.vue
│   │   │   ├── ArticleList.vue
│   │   │   ├── ArticleContent.vue
│   │   │   ├── TableOfContents.vue
│   │   │   └── TagCloud.vue
│   │   ├── Layout/
│   │   │   ├── Header.vue
│   │   │   ├── Footer.vue
│   │   │   ├── Navigation.vue
│   │   │   └── Sidebar.vue
│   │   └── UI/
│   │       ├── Pagination.vue
│   │       ├── SearchBox.vue
│   │       └── ThemeToggle.vue
│   ├── composables/              # 可重用的組合式函數
│   │   ├── useBlog.ts
│   │   ├── useContent.ts
│   │   └── useSEO.ts
│   ├── layouts/                  # 佈局組件
│   │   ├── default.vue
│   │   └── blog.vue
│   ├── middleware/               # 路由中間件
│   ├── pages/                    # 頁面組件 (自動路由)
│   │   ├── index.vue
│   │   ├── blog/
│   │   │   ├── index.vue
│   │   │   ├── [slug].vue
│   │   │   ├── category/
│   │   │   │   └── [category].vue
│   │   │   └── tag/
│   │   │       └── [tag].vue
│   │   └── [...slug].vue
│   ├── plugins/                  # Nuxt 插件
│   ├── utils/                    # 工具函數
│   │   ├── content.ts
│   │   └── seo.ts
│   ├── app.vue                   # 根組件
│   ├── app.config.ts             # 應用程式配置
│   └── error.vue                 # 錯誤頁面
├── content/                      # 內容目錄 (@nuxt/content)
│   ├── blog/
│   │   ├── hello-world.md
│   │   └── nuxt-v4-features.md
│   └── pages/
│       └── about.md
├── public/                       # 靜態資源 (直接提供)
│   ├── images/
│   └── favicon.ico
├── server/                       # 伺服器端 API (Nitro)
│   └── api/
│       └── search.ts
├── nuxt.config.ts               # Nuxt 配置
├── package.json                 # 專案依賴
└── tsconfig.json               # TypeScript 配置
```

### 核心組件設計

#### 1. ArticleCard.vue
```typescript
interface ArticleCardProps {
  article: {
    _path: string
    title: string
    description: string
    publishedAt: string
    category: string
    tags: string[]
    image?: string
    readingTime?: number
  }
  showExcerpt?: boolean
  showImage?: boolean
}
```

#### 2. ArticleContent.vue
```typescript
interface ArticleContentProps {
  article: {
    title: string
    description: string
    publishedAt: string
    updatedAt?: string
    category: string
    tags: string[]
    author?: string
    image?: string
    body: any // Nuxt Content parsed body
  }
  showToc?: boolean
}
```

#### 3. Pagination.vue
```typescript
interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  showFirstLast?: boolean
}
```

### 內容結構

#### Markdown Frontmatter 格式
```yaml
---
title: "文章標題"
description: "文章描述"
publishedAt: "2024-01-15"
updatedAt: "2024-01-16"
category: "技術"
tags: ["Vue", "Nuxt", "JavaScript"]
author: "作者名稱"
image: "/images/article-cover.jpg"
draft: false
featured: false
---
```

## Data Models

### 文章資料模型

```typescript
interface BlogArticle {
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
  readingTime?: {
    text: string
    minutes: number
    time: number
    words: number
  }
  body: any
  toc?: TocItem[]
}

interface TocItem {
  id: string
  depth: number
  text: string
  children?: TocItem[]
}

interface Category {
  name: string
  slug: string
  count: number
  description?: string
}

interface Tag {
  name: string
  slug: string
  count: number
}

interface BlogMeta {
  totalArticles: number
  categories: Category[]
  tags: Tag[]
  recentArticles: BlogArticle[]
  featuredArticles: BlogArticle[]
}
```

### 分頁資料模型

```typescript
interface PaginationData<T> {
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
```

## Error Handling

### 錯誤處理策略

1. **404 錯誤處理**
   - 自訂 404 頁面 (`error.vue`)
   - 提供搜尋功能和熱門文章推薦
   - 自動重導向到相似內容

2. **內容載入錯誤**
   - 使用 `try-catch` 包裝內容查詢
   - 提供載入狀態和錯誤狀態組件
   - 實作重試機制

3. **圖片載入錯誤**
   - 使用 `@nuxt/image` 的錯誤處理
   - 提供預設佔位圖片
   - 實作漸進式載入

4. **建置時錯誤**
   - Markdown 語法錯誤檢查
   - Frontmatter 驗證
   - 斷開連結檢測

### 錯誤處理實作

```typescript
// composables/useContent.ts
export const useContent = () => {
  const handleContentError = (error: any, fallback?: any) => {
    console.error('Content loading error:', error)
    
    if (process.client) {
      // 客戶端錯誤處理
      navigateTo('/404')
    }
    
    return fallback || null
  }

  return {
    handleContentError
  }
}
```

## Testing Strategy

### 測試層級

1. **單元測試**
   - 組件邏輯測試 (Vitest + Vue Test Utils)
   - Composables 功能測試
   - 工具函數測試

2. **整合測試**
   - 頁面渲染測試
   - 內容查詢測試
   - 路由導航測試

3. **端到端測試**
   - 使用者流程測試 (Playwright)
   - 跨瀏覽器相容性測試
   - 效能測試

### 測試工具配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'nuxt',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        'coverage/',
        '**/*.config.*'
      ]
    }
  }
})
```

### 關鍵測試案例

1. **內容渲染測試**
   - Markdown 轉 HTML 正確性
   - Frontmatter 解析準確性
   - 語法高亮功能

2. **導航測試**
   - 文章列表分頁
   - 分類和標籤篩選
   - 搜尋功能

3. **響應式測試**
   - 不同螢幕尺寸下的佈局
   - 行動裝置互動體驗

4. **SEO 測試**
   - Meta 標籤生成
   - 結構化資料
   - 網站地圖生成

5. **效能測試**
   - 頁面載入時間
   - 圖片優化效果
   - Core Web Vitals 指標

### Nuxt v4 特定配置

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Nuxt v4 的新配置選項
  future: {
    compatibilityVersion: 4
  },
  
  // 模組配置
  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/seo',
    '@nuxtjs/tailwindcss'
  ],
  
  // 內容配置
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark'
      },
      langs: ['javascript', 'typescript', 'vue', 'css', 'html', 'bash']
    },
    markdown: {
      toc: {
        depth: 3,
        searchDepth: 3
      }
    }
  },
  
  // Nitro 配置 (Nuxt v4 使用 Nitro 3)
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/rss.xml']
    }
  },
  
  // 實驗性功能
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true
  },
  
  // TypeScript 配置
  typescript: {
    strict: true,
    typeCheck: true
  }
})
```

### 持續整合

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
      - run: npm run build
      - run: npm run generate  # Nuxt v4 靜態生成
```

這個設計充分利用了 Nuxt v4 的新特性，包括 Vite 6 的效能提升、Vue 3.5 的響應式改進、以及 Nitro 3 的伺服器端優化，確保網站具有最佳的效能和開發體驗。
