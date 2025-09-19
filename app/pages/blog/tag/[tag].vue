<template>
  <div class="container mx-auto px-4 py-8">
    <BlogArticleList
      :articles="articles"
      :pending="pending"
      :error="error"
      :refresh="refresh"
      :title="pageTitle"
      :description="pageDescription"
      :total-count="articles?.length || 0"
      :show-pagination="false"
      :show-back-to-all="true"
      :columns="2"
      empty-message="此標籤目前沒有文章"
      empty-description="請查看其他標籤或返回所有文章"
    />
  </div>
</template>

<script setup lang="ts">
// 使用 blog 佈局
definePageMeta({
  layout: 'blog'
})

const route = useRoute()
const tag = route.params.tag as string

// 解碼標籤名稱
const decodedTag = decodeURIComponent(tag)

// 查詢包含該標籤的所有文章
const { data: articles, pending, error, refresh } = await useAsyncData(`tag-${tag}`, () =>
  queryContent('blog')
    .where({ 
      draft: { $ne: true },
      tags: { $contains: decodedTag }
    })
    .sort({ publishedAt: -1 })
    .find()
)

// 頁面標題和描述
const pageTitle = computed(() => `#${decodedTag} 標籤`)
const pageDescription = computed(() => {
  const count = articles.value?.length || 0
  return count > 0 
    ? `共有 ${count} 篇標記為「${decodedTag}」的文章`
    : `目前沒有標記為「${decodedTag}」的文章`
})

// 設定頁面 meta
useSeoMeta({
  title: `#${decodedTag} 標籤 - Markdown 部落格`,
  description: pageDescription.value,
  ogTitle: `#${decodedTag} 標籤`,
  ogDescription: pageDescription.value,
  ogType: 'website'
})

// 如果標籤不存在或沒有文章，記錄警告
watch(articles, (newArticles) => {
  if (newArticles && newArticles.length === 0 && !pending.value) {
    console.warn(`No articles found for tag: ${decodedTag}`)
  }
}, { immediate: true })
</script>
