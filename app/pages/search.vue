<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 搜尋標題 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        搜尋結果
      </h1>
      
      <!-- 搜尋框 -->
      <div class="max-w-2xl">
        <UISearchBox />
      </div>
      
      <!-- 搜尋資訊 -->
      <div v-if="searchQuery" class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-700 dark:text-gray-300">
              搜尋關鍵字：<span class="font-semibold">"{{ searchQuery }}"</span>
            </p>
            <p v-if="!pending" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ searchResults?.message || `找到 ${searchResults?.total || 0} 篇相關文章` }}
            </p>
          </div>
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 載入狀態 -->
    <UISkeletonLoader 
      v-if="pending" 
      type="search-results" 
      :count="3" 
    />

    <!-- 錯誤狀態 -->
    <UIEmptyState 
      v-else-if="error" 
      type="error" 
      :title="'搜尋時發生錯誤'"
      :description="error.message || '請稍後再試'"
    >
      <template #actions>
        <button @click="refresh()" class="btn-primary">
          重新搜尋
        </button>
      </template>
    </UIEmptyState>

    <!-- 搜尋結果 -->
    <div v-else-if="searchResults && searchResults.results.length > 0">
      <div class="space-y-6">
        <article
          v-for="article in searchResults.results"
          :key="article._path"
          class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
        >
          <!-- 文章標題 -->
          <h2 class="text-xl font-semibold mb-3">
            <NuxtLink 
              :to="article._path" 
              class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              v-html="highlightMatch(article.title, searchQuery)"
            >
            </NuxtLink>
          </h2>

          <!-- 文章摘要 -->
          <p 
            v-if="article.description" 
            class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3"
            v-html="highlightMatch(article.description, searchQuery)"
          >
          </p>

          <!-- 匹配資訊 -->
          <div v-if="article.matchedFields" class="mb-4">
            <div class="flex flex-wrap gap-2">
              <span 
                v-if="article.matchedFields.title"
                class="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs"
              >
                標題匹配
              </span>
              <span 
                v-if="article.matchedFields.description"
                class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
              >
                內容匹配
              </span>
              <span 
                v-if="article.matchedFields.category"
                class="inline-block bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs"
              >
                分類匹配
              </span>
              <span 
                v-if="article.matchedFields.tags"
                class="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-xs"
              >
                標籤匹配
              </span>
            </div>
          </div>

          <!-- 文章元數據 -->
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center space-x-4">
              <span>{{ formatDate(article.publishedAt) }}</span>
              <span 
                class="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                v-html="highlightMatch(article.category, searchQuery)"
              >
              </span>
              <span v-if="article.author">{{ article.author }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span v-if="article.searchScore" class="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                相關度: {{ article.searchScore }}
              </span>
            </div>
          </div>

          <!-- 標籤 -->
          <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
            <span
              v-for="tag in article.tags.slice(0, 5)"
              :key="tag"
              class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
              v-html="highlightMatch(`#${tag}`, searchQuery)"
            >
            </span>
          </div>
        </article>
      </div>
    </div>

    <!-- 無搜尋結果 -->
    <UIEmptyState 
      v-else-if="searchQuery" 
      type="no-search-results"
      :title="`沒有找到「${searchQuery}」的相關結果`"
      :description="'請嘗試使用不同的關鍵字搜尋，或者瀏覽所有文章來發現有趣的內容。'"
    >
      <template #actions>
        <div class="space-x-4">
          <button @click="clearSearch" class="btn-secondary">
            清除搜尋
          </button>
          <NuxtLink to="/blog" class="btn-primary">
            瀏覽所有文章
          </NuxtLink>
        </div>
      </template>
    </UIEmptyState>

    <!-- 預設狀態 -->
    <UIEmptyState 
      v-else 
      type="custom"
      title="開始搜尋"
      description="在上方搜尋框中輸入關鍵字來搜尋文章。"
    >
      <template #actions>
        <NuxtLink to="/blog" class="btn-primary">
          瀏覽所有文章
        </NuxtLink>
      </template>
    </UIEmptyState>
  </div>
</template>

<script setup lang="ts">
// 使用 default 佈局
definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()

// 從 URL 查詢參數獲取搜尋關鍵字
const searchQuery = ref((route.query.q as string) || '')

// 搜尋結果
const { data: searchResults, pending, error, refresh } = await useAsyncData(
  'search-results',
  () => {
    if (!searchQuery.value.trim()) {
      return Promise.resolve(null)
    }
    
    return $fetch('/api/search', {
      query: {
        q: searchQuery.value,
        limit: 50 // 搜尋結果頁面顯示更多結果
      }
    })
  },
  {
    watch: [searchQuery]
  }
)

const { formatDate } = useContentUtils()

// 清除搜尋
const clearSearch = () => {
  searchQuery.value = ''
  router.push('/search')
}

// 高亮匹配文字
const highlightMatch = (text: string, query: string): string => {
  if (!text || !query) return text
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}

// 監聽 URL 查詢參數變化
watch(() => route.query.q, (newQuery) => {
  searchQuery.value = (newQuery as string) || ''
}, { immediate: true })

// 設定頁面 meta
const pageTitle = computed(() => {
  return searchQuery.value 
    ? `搜尋「${searchQuery.value}」- Markdown 部落格`
    : '搜尋 - Markdown 部落格'
})

const pageDescription = computed(() => {
  if (searchQuery.value && searchResults.value) {
    return `搜尋「${searchQuery.value}」找到 ${searchResults.value.total} 篇相關文章`
  }
  return '搜尋部落格文章，找到您感興趣的內容'
})

useSeoMeta({
  title: pageTitle.value,
  description: pageDescription.value,
  ogTitle: pageTitle.value,
  ogDescription: pageDescription.value,
  ogType: 'website'
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

mark {
  background-color: #fef08a;
  padding: 0 2px;
  border-radius: 2px;
}

.dark mark {
  background-color: #a16207;
  color: #fef3c7;
}
</style>
