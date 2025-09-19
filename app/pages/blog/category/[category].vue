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
      empty-message="此分類目前沒有文章"
      empty-description="請查看其他分類或返回所有文章"
    />
  </div>
</template>

<script setup lang="ts">
// 使用 blog 佈局
definePageMeta({
  layout: 'blog'
})

const route = useRoute()
const category = route.params.category as string

// 解碼分類名稱
const decodedCategory = decodeURIComponent(category)

// 查詢該分類下的所有文章
const { data: articles, pending, error, refresh } = await useAsyncData(`category-${category}`, () =>
  queryContent('blog')
    .where({ 
      draft: { $ne: true },
      category: decodedCategory
    })
    .sort({ publishedAt: -1 })
    .find()
)

// 頁面標題和描述
const pageTitle = computed(() => `${decodedCategory} 分類`)
const pageDescription = computed(() => {
  const count = articles.value?.length || 0
  return count > 0 
    ? `共有 ${count} 篇關於「${decodedCategory}」的文章`
    : `目前「${decodedCategory}」分類下沒有文章`
})

// 設定頁面 meta
useSeoMeta({
  title: `${decodedCategory} 分類 - Markdown 部落格`,
  description: pageDescription.value,
  ogTitle: `${decodedCategory} 分類`,
  ogDescription: pageDescription.value,
  ogType: 'website'
})

// 如果分類不存在或沒有文章，可以考慮重導向
watch(articles, (newArticles) => {
  if (newArticles && newArticles.length === 0 && !pending.value) {
    // 可以在這裡添加 404 處理或重導向邏輯
    console.warn(`No articles found for category: ${decodedCategory}`)
  }
}, { immediate: true })
</script>
