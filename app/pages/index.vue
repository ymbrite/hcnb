<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 英雄區域 -->
    <section class="text-center mb-16">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        歡迎來到 Markdown 部落格
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        使用 Nuxt v4 建立的現代化部落格網站，分享技術文章和生活感悟
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/blog" class="btn-primary">
          瀏覽所有文章
        </NuxtLink>
        <NuxtLink to="/blog/category/技術" class="btn-secondary">
          技術文章
        </NuxtLink>
      </div>
    </section>

    <!-- 精選文章 -->
    <section class="mb-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">精選文章</h2>
        <NuxtLink 
          to="/blog" 
          class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          查看全部 →
        </NuxtLink>
      </div>
      
      <BlogArticleList
        :articles="featuredArticles"
        :pending="pending"
        :error="error"
        :show-header="false"
        :show-pagination="false"
        :columns="3"
        empty-message="目前沒有精選文章"
        empty-description="請稍後再來查看最新內容"
      />
    </section>

    <!-- 最新文章 -->
    <section>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">最新文章</h2>
        <NuxtLink 
          to="/blog" 
          class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          查看全部 →
        </NuxtLink>
      </div>
      
      <BlogArticleList
        :articles="recentArticles"
        :pending="pending"
        :error="error"
        :show-header="false"
        :show-pagination="false"
        :columns="2"
        empty-message="目前沒有文章"
        empty-description="請稍後再來查看最新內容"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
// 查詢精選文章和最新文章
const { data: allArticles, pending, error } = await useAsyncData('home-articles', () =>
  queryContent('blog')
    .where({ draft: { $ne: true } })
    .sort({ publishedAt: -1 })
    .find()
)

// 計算精選文章和最新文章
const featuredArticles = computed(() => {
  return allArticles.value?.filter(article => article.featured).slice(0, 3) || []
})

const recentArticles = computed(() => {
  return allArticles.value?.slice(0, 4) || []
})

// 設定頁面 meta
useSeoMeta({
  title: 'Markdown 部落格 - 首頁',
  description: '使用 Nuxt v4 建立的現代化 Markdown 部落格網站，分享技術文章和生活感悟'
})
</script>
