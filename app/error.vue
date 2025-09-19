<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full text-center px-4">
      <!-- 錯誤圖示 -->
      <div class="mb-8">
        <div class="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
      </div>

      <!-- 錯誤標題 -->
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">
        {{ error.statusCode || '錯誤' }}
      </h1>

      <!-- 錯誤訊息 -->
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        {{ getErrorTitle() }}
      </h2>

      <p class="text-gray-600 dark:text-gray-400 mb-8">
        {{ getErrorMessage() }}
      </p>

      <!-- 操作按鈕 -->
      <div class="space-y-4">
        <button
          @click="handleError"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          重新載入頁面
        </button>
        
        <NuxtLink
          to="/"
          class="block w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          返回首頁
        </NuxtLink>
        
        <NuxtLink
          to="/blog"
          class="block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          瀏覽文章
        </NuxtLink>
      </div>

      <!-- 錯誤詳情 (開發模式) -->
      <details v-if="isDev && error.stack" class="mt-8 text-left">
        <summary class="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
          顯示錯誤詳情
        </summary>
        <pre class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300 overflow-auto">{{ error.stack }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ErrorProps {
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
    stack?: string
  }
}

const props = defineProps<ErrorProps>()
const isDev = process.dev

// 設定 SEO meta
const { setNotFoundMeta, setLanguage } = useSEO()

if (props.error.statusCode === 404) {
  setNotFoundMeta()
} else {
  useSeoMeta({
    title: `錯誤 ${props.error.statusCode || ''} - Markdown Blog Site`,
    description: '頁面發生錯誤，請稍後再試或返回首頁。',
  })
}

setLanguage('zh-TW')

// 獲取錯誤標題
const getErrorTitle = (): string => {
  const statusCode = props.error.statusCode
  
  switch (statusCode) {
    case 404:
      return '頁面未找到'
    case 500:
      return '伺服器錯誤'
    case 403:
      return '存取被拒絕'
    case 401:
      return '未授權存取'
    default:
      return '發生錯誤'
  }
}

// 獲取錯誤訊息
const getErrorMessage = (): string => {
  const statusCode = props.error.statusCode
  
  switch (statusCode) {
    case 404:
      return '抱歉，您要找的頁面不存在。可能是網址輸入錯誤，或者頁面已被移除。'
    case 500:
      return '伺服器發生內部錯誤，請稍後再試。如果問題持續發生，請聯繫網站管理員。'
    case 403:
      return '您沒有權限存取此頁面。請確認您已登入並具有適當的權限。'
    case 401:
      return '您需要登入才能存取此頁面。請先登入您的帳戶。'
    default:
      return props.error.message || '發生未知錯誤，請稍後再試。'
  }
}

// 處理錯誤
const handleError = () => {
  clearError({ redirect: '/' })
}

// 設定頁面標題
useHead({
  title: `錯誤 ${props.error.statusCode || ''} - Markdown Blog Site`,
})
</script>
