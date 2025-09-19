<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 頁面標題 -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        文章標籤
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">
        透過標籤快速找到相關主題的文章
      </p>
    </div>

    <!-- 載入狀態 -->
    <div v-if="pending" class="text-center py-12">
      <div class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 mb-4"></div>
        <div class="bg-gray-200 dark:bg-gray-700 rounded h-4 w-1/2 mx-auto"></div>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 dark:text-red-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-xl font-semibold mb-2">載入標籤時發生錯誤</h3>
        <p class="text-gray-600 dark:text-gray-400">{{ error.message || '請稍後再試' }}</p>
      </div>
    </div>

    <!-- 標籤雲 -->
    <div v-else-if="tags && tags.length > 0">
      <!-- 統計資訊 -->
      <div class="text-center mb-8">
        <p class="text-gray-600 dark:text-gray-400">
          共有 <span class="font-semibold text-gray-900 dark:text-white">{{ tags.length }}</span> 個標籤
        </p>
      </div>

      <!-- 標籤雲 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <div class="flex flex-wrap gap-3 justify-center">
          <NuxtLink
            v-for="tag in tags"
            :key="tag.name"
            :to="`/blog/tag/${encodeURIComponent(tag.name)}`"
            :class="getTagClasses(tag.count)"
            class="inline-flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
          >
            <span class="mr-2">#{{ tag.name }}</span>
            <span class="text-xs opacity-75">{{ tag.count }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- 標籤列表 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">所有標籤</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="tag in sortedTags"
            :key="tag.name"
            :to="`/blog/tag/${encodeURIComponent(tag.name)}`"
            class="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center">
              <span class="text-gray-500 dark:text-gray-400 mr-2">#</span>
              <span class="text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ tag.name }}
              </span>
            </div>
            <span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-sm">
              {{ tag.count }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 空狀態 -->
    <div v-else class="text-center py-12">
      <div class="text-gray-500 dark:text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <h3 class="text-xl font-semibold mb-2">目前沒有標籤</h3>
        <p class="text-gray-600 dark:text-gray-400">請稍後再來查看</p>
      </div>
    </div>

    <!-- 返回連結 -->
    <div class="text-center mt-12">
      <NuxtLink to="/blog" class="btn-secondary">
        ← 返回所有文章
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// 使用 blog 佈局
definePageMeta({
  layout: 'blog'
})

// 查詢所有文章並統計標籤
const { data: allArticles, pending, error } = await useAsyncData('all-articles-for-tags', () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .only(['tags'])
    .find()
)

// 計算標籤統計
const tags = computed(() => {
  if (!allArticles.value) return []
  
  const tagMap = new Map<string, number>()
  
  allArticles.value.forEach(article => {
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach(tag => {
        const count = tagMap.get(tag) || 0
        tagMap.set(tag, count + 1)
      })
    }
  })
  
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count) // 按使用次數排序
})

// 按字母順序排序的標籤
const sortedTags = computed(() => {
  return [...tags.value].sort((a, b) => a.name.localeCompare(b.name))
})

// 根據標籤使用次數決定樣式
const getTagClasses = (count: number) => {
  const maxCount = Math.max(...tags.value.map(t => t.count))
  const ratio = count / maxCount
  
  if (ratio >= 0.8) {
    return 'text-lg font-bold bg-blue-600 text-white hover:bg-blue-700'
  } else if (ratio >= 0.6) {
    return 'text-base font-semibold bg-blue-500 text-white hover:bg-blue-600'
  } else if (ratio >= 0.4) {
    return 'text-sm font-medium bg-blue-400 text-white hover:bg-blue-500'
  } else if (ratio >= 0.2) {
    return 'text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
  } else {
    return 'text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
  }
}

// 設定頁面 meta
useSeoMeta({
  title: '文章標籤 - Markdown 部落格',
  description: '瀏覽所有文章標籤，透過標籤快速找到相關主題的內容',
  ogTitle: '文章標籤',
  ogDescription: '瀏覽所有文章標籤，透過標籤快速找到相關主題的內容',
  ogType: 'website'
})
</script>
