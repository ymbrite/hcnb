<template>
  <div class="relative" ref="searchContainer">
    <!-- 搜尋輸入框 -->
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜尋文章..."
        class="w-full px-4 py-2 pl-10 pr-12 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        @input="handleInput"
        @keydown.enter="performSearch"
        @keydown.escape="clearSearch"
        @focus="showSuggestions = true"
      >
      
      <!-- 搜尋圖標 -->
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <!-- 清除按鈕 -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- 搜尋建議下拉選單 -->
    <div
      v-if="showSuggestions && (suggestions.length > 0 || isLoading)"
      class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      <!-- 載入狀態 -->
      <div v-if="isLoading" class="p-4 text-center">
        <div class="loading-spinner w-5 h-5 mx-auto mb-2"></div>
        <p class="text-sm text-gray-500 dark:text-gray-400">搜尋中...</p>
      </div>
      
      <!-- 搜尋建議 -->
      <div v-else-if="suggestions.length > 0">
        <div class="p-2 border-b border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            搜尋建議 ({{ suggestions.length }})
          </p>
        </div>
        
        <div class="max-h-80 overflow-y-auto">
          <NuxtLink
            v-for="suggestion in suggestions"
            :key="suggestion._path"
            :to="suggestion._path"
            @click="hideSuggestions"
            class="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0 mt-1">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate" v-html="highlightMatch(suggestion.title, searchQuery)"></h4>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2" v-html="highlightMatch(suggestion.description || '', searchQuery)"></p>
                <div class="flex items-center mt-2 space-x-2">
                  <span class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                    {{ suggestion.category }}
                  </span>
                  <span class="text-xs text-gray-400">
                    {{ formatDate(suggestion.publishedAt) }}
                  </span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
        
        <!-- 查看更多結果 -->
        <div class="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <NuxtLink
            :to="`/search?q=${encodeURIComponent(searchQuery)}`"
            @click="hideSuggestions"
            class="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            查看所有搜尋結果 →
          </NuxtLink>
        </div>
      </div>
      
      <!-- 無結果 -->
      <div v-else class="p-4 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">沒有找到相關文章</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface SearchBoxProps {
  placeholder?: string
  showSuggestionsCount?: number
}

const props = withDefaults(defineProps<SearchBoxProps>(), {
  placeholder: '搜尋文章...',
  showSuggestionsCount: 5
})

// 搜尋狀態
const searchQuery = ref('')
const suggestions = ref<any[]>([])
const isLoading = ref(false)
const showSuggestions = ref(false)
const searchContainer = ref<HTMLElement>()

// 防抖搜尋
let searchTimeout: NodeJS.Timeout

const { formatDate } = useContentUtils()

// 處理輸入
const handleInput = () => {
  clearTimeout(searchTimeout)
  
  if (searchQuery.value.trim().length < 2) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }
  
  searchTimeout = setTimeout(() => {
    performSuggestionSearch()
  }, 300)
}

// 執行建議搜尋
const performSuggestionSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  isLoading.value = true
  showSuggestions.value = true
  
  try {
    const response = await $fetch('/api/search', {
      query: {
        q: searchQuery.value,
        limit: props.showSuggestionsCount
      }
    })
    
    suggestions.value = response.results || []
  } catch (error) {
    console.error('Search suggestions error:', error)
    suggestions.value = []
  } finally {
    isLoading.value = false
  }
}

// 執行完整搜尋
const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    hideSuggestions()
  }
}

// 清除搜尋
const clearSearch = () => {
  searchQuery.value = ''
  suggestions.value = []
  showSuggestions.value = false
}

// 隱藏建議
const hideSuggestions = () => {
  showSuggestions.value = false
}

// 高亮匹配文字
const highlightMatch = (text: string, query: string): string => {
  if (!text || !query) return text
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>')
}

// 點擊外部關閉建議
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
      hideSuggestions()
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    clearTimeout(searchTimeout)
  })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
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
