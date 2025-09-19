<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 頁面標題 -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">文章分類</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">瀏覽不同主題的文章內容</p>
    </div>

    <!-- 載入狀態 -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
      </div>
    </div>

    <!-- 錯誤狀態 -->
    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 dark:text-red-400 mb-4">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 class="text-xl font-semibold mb-2">載入分類時發生錯誤</h3>
        <p class="text-gray-600 dark:text-gray-400">{{ error.message || '請稍後再試' }}</p>
      </div>
    </div>

    <!-- 分類列表 -->
    <div v-else-if="categories && categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
        v-for="category in categories"
        :key="category.name"
        :to="`/blog/category/${encodeURIComponent(category.name)}`"
        class="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
      >
        <div class="flex items-center justify-between mb-4">
          <h3
            class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            {{ category.name }}
          </h3>
          <span
            class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ category.count }}
          </span>
        </div>

        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ category.description || `探索 ${category.count} 篇關於「${category.name}」的文章` }}
        </p>

        <div
          class="flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors"
        >
          <span class="text-sm font-medium">查看文章</span>
          <svg
            class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </NuxtLink>
    </div>

    <!-- 空狀態 -->
    <div v-else class="text-center py-12">
      <div class="text-gray-500 dark:text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 class="text-xl font-semibold mb-2">目前沒有分類</h3>
        <p class="text-gray-600 dark:text-gray-400">請稍後再來查看</p>
      </div>
    </div>

    <!-- 返回連結 -->
    <div class="text-center mt-12">
      <NuxtLink to="/blog" class="btn-secondary"> ← 返回所有文章 </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// 使用 blog 佈局
definePageMeta({
  layout: 'blog',
})

// 查詢所有文章並統計分類
const {
  data: allArticles,
  pending,
  error,
} = await useAsyncData('all-articles-for-categories', () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .only(['category'])
    .find(),
)

// 定義分類介面
interface Category {
  name: string
  count: number
  description?: string
}

// 分類描述映射
const categoryDescriptions: Record<string, string> = {
  技術: '深入探討各種技術主題，包括程式設計、框架和工具',
  教學: '詳細的教學指南和步驟說明',
  生活: '生活感悟和日常分享',
  公告: '重要公告和網站更新資訊',
}

// 計算分類統計
const categories = computed((): Category[] => {
  if (!allArticles.value) return []

  const categoryMap = new Map<string, number>()

  allArticles.value.forEach((article) => {
    if (article.category) {
      const count = categoryMap.get(article.category) || 0
      categoryMap.set(article.category, count + 1)
    }
  })

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      description: categoryDescriptions[name], // 使用預定義的描述
    }))
    .sort((a, b) => b.count - a.count) // 按文章數量排序
})

// 設定頁面 meta
useSeoMeta({
  title: '文章分類 - Markdown 部落格',
  description: '瀏覽不同主題的文章分類，找到您感興趣的內容',
  ogTitle: '文章分類',
  ogDescription: '瀏覽不同主題的文章分類，找到您感興趣的內容',
  ogType: 'website',
})
</script>
