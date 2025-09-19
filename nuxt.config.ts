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
})
