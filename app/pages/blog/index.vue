<template>
  <div class="container mx-auto px-4 py-8">
    <BlogArticleList
      :articles="data"
      :pending="pending"
      :error="error"
      :refresh="refresh"
      title="所有文章"
      description="探索我們的技術文章和分享"
      :total-count="data?.length || 0"
      :show-pagination="false"
      :columns="2"
    />
  </div>
</template>

<script setup lang="ts">
// 使用 blog 佈局
definePageMeta({
  layout: 'blog'
})

// 查詢所有部落格文章
const { data, pending, error, refresh } = await useAsyncData('blog-articles', () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .sort({ publishedAt: -1 })
    .find(),
)

// 設定頁面 meta
useSeoMeta({
  title: '所有文章 - Markdown 部落格',
  description: '瀏覽所有部落格文章',
})
</script>
