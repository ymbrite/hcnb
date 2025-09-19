export default defineNuxtConfig({
  // 相容性日期
  compatibilityDate: '2025-09-18',

  // Nuxt v4 的新配置選項
  future: {
    compatibilityVersion: 4,
  },

  // 開發工具
  devtools: { enabled: true },

  // 模組配置
  modules: ['@nuxt/content', '@nuxt/image', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],

  // 內容配置
  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
      langs: ['javascript', 'typescript', 'vue', 'css', 'html', 'bash', 'json', 'yaml', 'markdown'],
    },
    markdown: {
      toc: {
        depth: 3,
        searchDepth: 3,
      },
      anchorLinks: true,
    },
  },

  // TypeScript 配置 - 暫時關閉 typeCheck 避免 vue-tsc 問題
  typescript: {
    typeCheck: false,
  },

  // 顏色模式配置
  colorMode: {
    preference: 'system', // 預設使用系統設定
    fallback: 'light', // 如果無法偵測系統設定，使用淺色模式
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },

  // CSS 配置
  css: ['~/assets/css/main.css'],

  // SEO 和 meta 配置
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Markdown Blog Site',
      meta: [
        { name: 'description', content: '一個基於 Nuxt v4 和 Markdown 的現代部落格網站' },
        { name: 'keywords', content: 'blog, markdown, nuxt, vue, typescript' },
        { name: 'author', content: 'Blog Author' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Markdown Blog Site' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@blogsite' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://your-blog-site.com' },
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'RSS Feed', href: '/rss.xml' },
      ],
    },
  },

  // 圖片優化配置
  image: {
    quality: 80,
    format: ['webp', 'avif', 'jpg', 'png'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    densities: [1, 2],
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 64,
          height: 64,
          quality: 90,
        },
      },
      thumbnail: {
        modifiers: {
          format: 'webp',
          width: 300,
          height: 200,
          quality: 80,
        },
      },
      hero: {
        modifiers: {
          format: 'webp',
          width: 1200,
          height: 630,
          quality: 85,
        },
      },
    },
  },

  // 網站地圖和 RSS 配置
  nitro: {
    prerender: {
      routes: [],
      crawlLinks: true,
      failOnError: false,
    },
    routeRules: {
      // 首頁 - 高優先級，經常更新
      '/': { prerender: true, headers: { 'cache-control': 's-maxage=3600' } },

      // 部落格相關頁面
      '/blog': { prerender: true, headers: { 'cache-control': 's-maxage=3600' } },
      '/blog/category': { prerender: true, headers: { 'cache-control': 's-maxage=7200' } },
      '/blog/tag': { prerender: true, headers: { 'cache-control': 's-maxage=7200' } },
      '/search': { prerender: true, headers: { 'cache-control': 's-maxage=3600' } },

      // 文章頁面 - 長期快取
      '/blog/**': { prerender: true, headers: { 'cache-control': 's-maxage=86400' } },

      // API 路由
      '/api/**': { headers: { 'cache-control': 's-maxage=3600' } },

      // 網站地圖和 RSS
      '/sitemap.xml': {
        proxy: '/api/sitemap.xml',
        headers: { 'Content-Type': 'application/xml', 'cache-control': 's-maxage=3600' },
      },
      '/rss.xml': {
        proxy: '/api/rss.xml',
        headers: { 'Content-Type': 'application/rss+xml', 'cache-control': 's-maxage=3600' },
      },
    },
  },

  // 實驗性功能
  experimental: {
    payloadExtraction: false,
  },
})
