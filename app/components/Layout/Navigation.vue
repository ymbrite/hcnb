<template>
  <nav class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-14">
        <!-- 主要導航 -->
        <div class="flex items-center space-x-8">
          <NuxtLink
            to="/"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/' }"
          >
            首頁
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            :class="{ 'text-blue-600 dark:text-blue-400': $route.path.startsWith('/blog') }"
          >
            文章
          </NuxtLink>
        </div>

        <!-- 次要導航 (分類、標籤等) -->
        <div class="hidden lg:flex items-center space-x-6">
          <div class="relative group">
            <button
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center"
            >
              分類
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- 分類下拉選單 -->
            <div
              class="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <div class="py-2">
                <NuxtLink
                  v-for="category in categories"
                  :key="category.slug"
                  :to="`/blog/category/${category.slug}`"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {{ category.name }}
                  <span class="text-gray-500 dark:text-gray-400 text-xs ml-2">({{ category.count }})</span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="relative group">
            <button
              class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center"
            >
              標籤
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- 標籤下拉選單 -->
            <div
              class="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <div class="py-2 max-h-64 overflow-y-auto">
                <NuxtLink
                  v-for="tag in tags"
                  :key="tag.slug"
                  :to="`/blog/tag/${tag.slug}`"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {{ tag.name }}
                  <span class="text-gray-500 dark:text-gray-400 text-xs ml-2">({{ tag.count }})</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 使用 useBlog composable 獲取分類和標籤
const { getCategories, getTags } = useBlog()

// 獲取分類和標籤資料
const { data: categories } = await getCategories()
const { data: tags } = await getTags()
</script>
