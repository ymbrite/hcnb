<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">內容調試頁面</h1>
    
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">所有文章</h2>
      <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">{{ JSON.stringify(allArticles, null, 2) }}</pre>
    </div>
    
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">特定文章 (nuxt-v4-features)</h2>
      <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">{{ JSON.stringify(specificArticle, null, 2) }}</pre>
    </div>
    
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">路徑測試</h2>
      <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto">{{ JSON.stringify(pathTest, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
// 查詢所有文章
const { data: allArticles } = await useAsyncData('debug-all', () =>
  queryContent('blog').find()
)

// 查詢特定文章
const { data: specificArticle } = await useAsyncData('debug-specific', () =>
  queryContent('blog', 'nuxt-v4-features').findOne()
)

// 路徑測試
const { data: pathTest } = await useAsyncData('debug-path', () =>
  queryContent().where({ _path: '/blog/nuxt-v4-features' }).findOne()
)
</script>
