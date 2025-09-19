<template>
  <div class="skeleton-loader" :class="containerClass">
    <!-- 文章卡片骨架屏 -->
    <template v-if="type === 'article-card'">
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- 圖片骨架 -->
        <div v-if="showImage" class="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
        
        <!-- 內容骨架 -->
        <div class="p-6 space-y-4">
          <!-- 分類標籤骨架 -->
          <div class="flex items-center justify-between">
            <div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div class="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          
          <!-- 標題骨架 -->
          <div class="space-y-2">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          
          <!-- 描述骨架 -->
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          
          <!-- 元數據骨架 -->
          <div class="flex items-center space-x-4">
            <div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          
          <!-- 標籤骨架 -->
          <div class="flex flex-wrap gap-2">
            <div class="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
            <div class="h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 文章內容骨架屏 -->
    <template v-else-if="type === 'article-content'">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- 標題區域骨架 -->
        <div class="space-y-6">
          <div class="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div class="space-y-4">
            <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-12 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div class="space-y-2">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div class="flex flex-wrap gap-4">
            <div class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        
        <!-- 封面圖片骨架 -->
        <div class="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        
        <!-- 內容骨架 -->
        <div class="space-y-6">
          <div v-for="i in 8" :key="i" class="space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 文章列表骨架屏 -->
    <template v-else-if="type === 'article-list'">
      <div class="space-y-6">
        <div v-for="i in count" :key="i">
          <SkeletonLoader type="article-card" :show-image="showImage" />
        </div>
      </div>
    </template>
    
    <!-- 搜尋結果骨架屏 -->
    <template v-else-if="type === 'search-results'">
      <div class="space-y-4">
        <div v-for="i in count" :key="i" class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="space-y-3">
            <div class="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div class="flex items-center space-x-4 mt-4">
              <div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- 通用文字骨架屏 -->
    <template v-else-if="type === 'text'">
      <div class="space-y-3">
        <div v-for="i in lines" :key="i" 
             :class="[
               'bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
               i === lines ? 'w-3/4' : 'w-full',
               height === 'sm' ? 'h-3' : height === 'lg' ? 'h-6' : 'h-4'
             ]">
        </div>
      </div>
    </template>
    
    <!-- 自定義骨架屏 -->
    <template v-else>
      <div :class="[
        'bg-gray-200 dark:bg-gray-700 rounded animate-pulse',
        width,
        height === 'sm' ? 'h-4' : height === 'lg' ? 'h-8' : 'h-6'
      ]">
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
interface SkeletonLoaderProps {
  type?: 'article-card' | 'article-content' | 'article-list' | 'search-results' | 'text' | 'custom'
  count?: number
  lines?: number
  width?: string
  height?: 'sm' | 'md' | 'lg'
  showImage?: boolean
  containerClass?: string
}

withDefaults(defineProps<SkeletonLoaderProps>(), {
  type: 'custom',
  count: 3,
  lines: 3,
  width: 'w-full',
  height: 'md',
  showImage: true,
  containerClass: ''
})
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
