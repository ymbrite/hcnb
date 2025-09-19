<template>
  <div class="space-y-8">
    <!-- 載入狀態 -->
    <div v-if="pending" class="space-y-6">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>
      </div>
    </div>
    
    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 dark:text-red-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-xl font-semibold mb-2">載入文章時發生錯誤</h3>
        <p class="text-gray-600 dark:text-gray-400">{{ error.message || '請稍後再試' }}</p>
      </div>
      <button 
        v-if="refresh"
        @click="refresh()"
        class="btn-primary"
      >
        重新載入
      </button>
    </div>
    
    <!-- 空狀態 -->
    <div v-else-if="!articles || articles.length === 0" class="text-center py-12">
      <div class="text-gray-500 dark:text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-xl font-semibold mb-2">{{ emptyMessage }}</h3>
        <p class="text-gray-600 dark:text-gray-400">{{ emptyDescription }}</p>
      </div>
      <NuxtLink v-if="showBackToAll" to="/blog" class="btn-secondary mt-4">
        查看所有文章
      </NuxtLink>
    </div>
    
    <!-- 文章列表 -->
    <div v-else>
      <!-- 列表標題和統計 -->
      <div v-if="showHeader" class="flex items-center justify-between mb-8">
        <div>
          <h1 v-if="title" class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {{ title }}
          </h1>
          <p v-if="description" class="text-gray-600 dark:text-gray-400">
            {{ description }}
          </p>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          共 {{ totalCount }} 篇文章
        </div>
      </div>
      
      <!-- 文章網格 -->
      <div :class="gridClass">
        <BlogArticleCard
          v-for="article in articles"
          :key="article._path"
          :article="article"
          :show-excerpt="showExcerpt"
          :show-image="showImage"
          class="fade-in"
        />
      </div>
      
      <!-- 分頁 -->
      <div v-if="showPagination && totalPages > 1" class="mt-12">
        <UIPagination
          :current-page="currentPage"
          :total-pages="totalPages"
          :base-url="baseUrl"
          :show-first-last="true"
        />
      </div>
      
      <!-- 載入更多按鈕 -->
      <div v-if="showLoadMore && hasMore" class="text-center mt-8">
        <button
          @click="loadMore"
          :disabled="loadingMore"
          class="btn-secondary"
        >
          <span v-if="loadingMore" class="flex items-center">
            <div class="loading-spinner w-4 h-4 mr-2"></div>
            載入中...
          </span>
          <span v-else>載入更多文章</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ArticleListProps {
  articles?: any[]
  pending?: boolean
  error?: Error | null
  refresh?: () => void
  
  // 顯示選項
  showHeader?: boolean
  showExcerpt?: boolean
  showImage?: boolean
  showPagination?: boolean
  showLoadMore?: boolean
  showBackToAll?: boolean
  
  // 內容
  title?: string
  description?: string
  emptyMessage?: string
  emptyDescription?: string
  
  // 分頁
  currentPage?: number
  totalPages?: number
  totalCount?: number
  baseUrl?: string
  hasMore?: boolean
  loadingMore?: boolean
  
  // 佈局
  layout?: 'grid' | 'list' | 'masonry'
  columns?: 1 | 2 | 3 | 4
}

const props = withDefaults(defineProps<ArticleListProps>(), {
  showHeader: true,
  showExcerpt: true,
  showImage: true,
  showPagination: true,
  showLoadMore: false,
  showBackToAll: false,
  
  emptyMessage: '目前沒有文章',
  emptyDescription: '請稍後再來查看',
  
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  baseUrl: '/blog',
  hasMore: false,
  loadingMore: false,
  
  layout: 'grid',
  columns: 2
})

const emit = defineEmits<{
  loadMore: []
}>()

// 計算網格樣式
const gridClass = computed(() => {
  if (props.layout === 'list') {
    return 'space-y-6'
  }
  
  const columnClasses = {
    1: 'grid grid-cols-1 gap-6',
    2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
  }
  
  return columnClasses[props.columns] || columnClasses[2]
})

// 載入更多
const loadMore = () => {
  emit('loadMore')
}
</script>
