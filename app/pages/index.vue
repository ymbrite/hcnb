<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center mb-8">
      歡迎來到 Markdown 部落格
    </h1>
    <p class="text-center text-gray-600 dark:text-gray-400 mb-8">
      使用 Nuxt v4 建立的現代化部落格網站
    </p>
    
    <!-- 臨時連結到文章 -->
    <div class="text-center">
      <NuxtLink 
        to="/blog" 
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        查看所有文章
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// 設定頁面 meta
useSeoMeta({
  title: 'Markdown 部落格 - 首頁',
  description: '使用 Nuxt v4 建立的現代化 Markdown 部落格網站'
})
</script>
