<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">所有文章</h1>

    <div v-if="!data || data.length === 0" class="text-center text-gray-600">目前沒有文章</div>

    <div v-else class="space-y-6">
      <article
        v-for="article in data"
        :key="article._path"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
      >
        <h2 class="text-xl font-semibold mb-2">
          <NuxtLink :to="article._path" class="text-blue-600 dark:text-blue-400 hover:underline">
            {{ article.title }}
          </NuxtLink>
        </h2>

        <p class="text-gray-600 dark:text-gray-400 mb-4">
          {{ article.description }}
        </p>

        <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{{ formatDate(article.publishedAt) }}</span>
          <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
            {{ article.category }}
          </span>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
// 使用 blog 佈局
definePageMeta({
  layout: 'blog'
})

// 查詢所有部落格文章 - 使用 refresh 來處理異步
const { data, refresh } = await useAsyncData('blog-articles', () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .sort({ publishedAt: -1 })
    .find(),
)

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 設定頁面 meta
useSeoMeta({
  title: '所有文章 - Markdown 部落格',
  description: '瀏覽所有部落格文章',
})
</script>
