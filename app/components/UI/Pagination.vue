<template>
  <nav class="flex items-center justify-center space-x-2" aria-label="分頁導航">
    <!-- 第一頁 -->
    <NuxtLink
      v-if="showFirstLast && currentPage > 2"
      :to="`${baseUrl}?page=1`"
      class="pagination-btn"
      aria-label="第一頁"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    </NuxtLink>
    
    <!-- 上一頁 -->
    <NuxtLink
      v-if="currentPage > 1"
      :to="`${baseUrl}?page=${currentPage - 1}`"
      class="pagination-btn"
      aria-label="上一頁"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      <span class="hidden sm:inline ml-1">上一頁</span>
    </NuxtLink>
    
    <!-- 頁碼 -->
    <div class="flex items-center space-x-1">
      <template v-for="page in visiblePages" :key="page">
        <!-- 省略號 -->
        <span v-if="page === '...'" class="px-3 py-2 text-gray-500 dark:text-gray-400">
          ...
        </span>
        
        <!-- 頁碼按鈕 -->
        <NuxtLink
          v-else
          :to="page === 1 ? baseUrl : `${baseUrl}?page=${page}`"
          :class="[
            'pagination-btn',
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : ''
          ]"
          :aria-label="`第 ${page} 頁`"
          :aria-current="page === currentPage ? 'page' : undefined"
        >
          {{ page }}
        </NuxtLink>
      </template>
    </div>
    
    <!-- 下一頁 -->
    <NuxtLink
      v-if="currentPage < totalPages"
      :to="`${baseUrl}?page=${currentPage + 1}`"
      class="pagination-btn"
      aria-label="下一頁"
    >
      <span class="hidden sm:inline mr-1">下一頁</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </NuxtLink>
    
    <!-- 最後一頁 -->
    <NuxtLink
      v-if="showFirstLast && currentPage < totalPages - 1"
      :to="`${baseUrl}?page=${totalPages}`"
      class="pagination-btn"
      aria-label="最後一頁"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  showFirstLast?: boolean
  maxVisible?: number
}

const props = withDefaults(defineProps<PaginationProps>(), {
  showFirstLast: false,
  maxVisible: 7
})

// 計算可見的頁碼
const visiblePages = computed(() => {
  const { currentPage, totalPages, maxVisible } = props
  const pages: (number | string)[] = []
  
  if (totalPages <= maxVisible) {
    // 如果總頁數小於等於最大可見數，顯示所有頁碼
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // 複雜的分頁邏輯
    const halfVisible = Math.floor(maxVisible / 2)
    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)
    
    // 調整起始和結束頁碼以確保顯示足夠的頁碼
    if (endPage - startPage + 1 < maxVisible) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisible - 1)
      } else {
        startPage = Math.max(1, endPage - maxVisible + 1)
      }
    }
    
    // 添加第一頁和省略號
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }
    
    // 添加中間的頁碼
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    // 添加省略號和最後一頁
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }
  }
  
  return pages
})
</script>

<style scoped>
.pagination-btn {
  @apply px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.pagination-btn:hover {
  @apply shadow-sm;
}
</style>
