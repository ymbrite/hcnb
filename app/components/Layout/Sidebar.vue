<template>
  <aside class="w-full lg:w-80 space-y-6">
    <!-- 搜尋框 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        搜尋文章
      </h3>
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="輸入關鍵字..."
          class="w-full px-4 py-2 pl-10 pr-4 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          @keyup.enter="performSearch"
        >
        <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- 最新文章 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        最新文章
      </h3>
      <div class="space-y-4">
        <article 
          v-for="article in recentArticles" 
          :key="article._path"
          class="group"
        >
          <NuxtLink 
            :to="article._path"
            class="block hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-3 -m-3 transition-colors"
          >
            <h4 class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
              {{ article.title }}
            </h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ formatDate(article.publishedAt) }}
            </p>
          </NuxtLink>
        </article>
      </div>
    </div>

    <!-- 分類 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        文章分類
      </h3>
      <div class="space-y-2">
        <NuxtLink 
          v-for="category in categories" 
          :key="category.slug"
          :to="`/blog/category/${category.slug}`"
          class="flex items-center justify-between py-2 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
        >
          <span class="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {{ category.name }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {{ category.count }}
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- 熱門標籤 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        熱門標籤
      </h3>
      <div class="flex flex-wrap gap-2">
        <NuxtLink 
          v-for="tag in popularTags" 
          :key="tag.slug"
          :to="`/blog/tag/${tag.slug}`"
          class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          {{ tag.name }}
          <span class="ml-1 text-xs text-gray-500 dark:text-gray-400">
            {{ tag.count }}
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- 歸檔 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        文章歸檔
      </h3>
      <div class="space-y-2">
        <div 
          v-for="archive in archives" 
          :key="archive.year + '-' + archive.month"
          class="flex items-center justify-between py-2 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          <span>{{ archive.year }}年{{ archive.month }}月</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {{ archive.count }}
          </span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { getRecentArticles, getCategories, getTags, getArchives } = useBlog()
const { formatDate } = useContentUtils()

// 搜尋功能
const searchQuery = ref('')

const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/blog/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

// 獲取側邊欄資料
const { data: recentArticles } = await getRecentArticles(5)
const { data: categories } = await getCategories()
const { data: allTags } = await getTags()

// 取得熱門標籤 (按文章數量排序，取前10個)
const popularTags = computed(() => {
  return allTags.value
    ?.sort((a, b) => b.count - a.count)
    .slice(0, 10) || []
})

// 獲取歸檔資料 (這裡先用模擬資料，實際應該從 composable 獲取)
const archives = ref([
  { year: 2024, month: 12, count: 5 },
  { year: 2024, month: 11, count: 8 },
  { year: 2024, month: 10, count: 6 },
  { year: 2024, month: 9, count: 4 },
])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
