<template>
  <div class="space-y-8">
    <!-- 載入狀態 -->
    <UISkeletonLoader 
      v-if="pending" 
      type="article-list" 
      :count="3" 
      :show-image="showImage" 
    />
    
    <!-- 錯誤狀態 -->
    <UIEmptyState 
      v-else-if="error" 
      type="error" 
      :title="'載入文章時發生錯誤'"
      :description="error.message || '請稍後再試'"
    >
      <template #actions>
        <button 
          v-if="refresh"
          @click="refresh()"
          class="btn-primary"
        >
          重新載入
        </button>
      </template>
    </UIEmptyState>
    
    <!-- 空狀態 -->
    <UIEmptyState 
      v-else-if="!articles || articles.length === 0" 
      type="no-articles"
      :title="emptyMessage"
      :description="emptyDescription"
    >
      <template #actions>
        <NuxtLink v-if="showBackToAll" to="/blog" class="btn-secondary">
          查看所有文章
        </NuxtLink>
      </template>
    </UIEmptyState>
    
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
