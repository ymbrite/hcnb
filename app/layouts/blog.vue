<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <LayoutHeader />
    
    <main class="flex-1">
      <!-- 麵包屑導航 -->
      <div class="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div class="container mx-auto px-4 py-3">
          <nav class="flex items-center space-x-2 text-sm">
            <NuxtLink 
              to="/" 
              class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              首頁
            </NuxtLink>
            <span class="text-gray-400 dark:text-gray-600">/</span>
            <NuxtLink 
              to="/blog" 
              class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              部落格
            </NuxtLink>
            <span v-if="currentBreadcrumb" class="text-gray-400 dark:text-gray-600">/</span>
            <span v-if="currentBreadcrumb" class="text-gray-900 dark:text-gray-100 font-medium">
              {{ currentBreadcrumb }}
            </span>
          </nav>
        </div>
      </div>
      
      <slot />
    </main>
    
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

// 根據當前路由生成麵包屑
const currentBreadcrumb = computed(() => {
  const path = route.path
  
  if (path === '/blog') {
    return null
  }
  
  if (path.startsWith('/blog/category/')) {
    const category = route.params.category as string
    return `${category} 分類`
  }
  
  if (path.startsWith('/blog/tag/')) {
    const tag = route.params.tag as string
    return `${tag} 標籤`
  }
  
  if (path.startsWith('/blog/')) {
    // 這是文章頁面，可以從 meta 或 params 獲取標題
    return '文章詳情'
  }
  
  return null
})
</script>
