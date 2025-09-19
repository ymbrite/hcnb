# Implementation Plan

- [x] 1. 建立 Nuxt v4 專案基礎架構

  - 初始化 Nuxt v4 專案並安裝必要依賴 (@nuxt/content, @nuxt/image, @nuxtjs/tailwindcss)
  - 配置 nuxt.config.ts 啟用 Nuxt v4 相容模式和必要模組
  - 建立基本目錄結構 (app/, content/, public/)
  - _Requirements: 1.1, 7.1_

- [x] 2. 設定內容管理和資料模型

  - 配置 @nuxt/content 模組選項 (Markdown 解析、語法高亮)
  - 定義 BlogArticle、Category、Tag 等 TypeScript 介面
  - 建立範例 Markdown 檔案測試內容解析
  - _Requirements: 1.1, 1.2, 7.4_

- [x] 3. 建立核心 Composables

  - 實作 useBlog composable (文章查詢、分頁、篩選)
  - 實作 useSEO composable (動態 meta 標籤、結構化資料)
  - 加入錯誤處理和載入狀態管理
  - _Requirements: 2.1, 2.3, 4.1, 4.2, 6.1, 6.2_

- [x] 4. 建立基礎佈局和導航

  - 實作 default.vue 佈局和響應式導航
  - 建立 Header、Footer 組件
  - 加入主題切換功能 (明暗模式)
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 5. 實作文章相關組件

  - 建立 ArticleCard 組件 (文章卡片顯示)
  - 建立 ArticleList 組件 (文章列表和分頁)
  - 建立 ArticleContent 組件 (Markdown 渲染、語法高亮)
  - 建立 TableOfContents 組件 (目錄導航)
  - _Requirements: 1.1, 1.3, 1.4, 2.1, 2.2, 2.3, 3.2, 3.3_

- [x] 6. 實作主要頁面

  - 建立首頁 (index.vue) - 文章列表和精選內容
  - 建立文章詳細頁 (blog/[slug].vue) - 完整文章顯示
  - 建立文章列表頁 (blog/index.vue) - 分頁文章列表
  - 建立分類和標籤頁面 (category/[category].vue, tag/[tag].vue)
  - _Requirements: 2.1, 2.2, 3.1, 3.4, 4.1, 4.2, 4.3_

- [x] 7. 實作搜尋功能

  - 建立搜尋 API (server/api/search.ts)
  - 建立 SearchBox 組件 (即時搜尋)
  - 實作搜尋結果頁面和高亮顯示
  - _Requirements: 2.1, 4.1, 4.2_

- [x] 8. SEO 優化和圖片處理

  - 配置動態 meta 標籤和 Open Graph
  - 實作 @nuxt/image 圖片優化和響應式圖片
  - 建立網站地圖和 RSS 訂閱功能
  - _Requirements: 1.4, 6.1, 6.2, 6.3_

- [x] 9. 完善 UI 和錯誤處理
  - 建立 Pagination、TagCloud 組件
  - 實作 error.vue 錯誤頁面和載入狀態
  - 加入骨架屏和空狀態處理
  - 配置靜態生成和部署準備
  - _Requirements: 2.3, 4.3, 4.4, 5.1, 6.4_
