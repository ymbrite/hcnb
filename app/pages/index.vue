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

    <!-- 快速導航 -->
    <section class="mb-16">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">探索內容</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- 分類導航 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">文章分類</h3>
            <NuxtLink 
              to="/blog/category" 
              class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              查看全部 →
            </NuxtLink>
          </div>
          <div class="space-y-3">
            <NuxtLink
              v-for="category in topCategories"
              :key="category.name"
              :to="`/blog/category/${encodeURIComponent(category.name)}`"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <span class="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ category.name }}
              </span>
              <span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-sm">
                {{ category.count }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- 熱門標籤 -->
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">熱門標籤</h3>
            <NuxtLink 
              to="/blog/tag" 
              class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
            >
              查看全部 →
            </NuxtLink>
          </div>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="tag in topTags"
              :key="tag.name"
              :to="`/blog/tag/${encodeURIComponent(tag.name)}`"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              #{{ tag.name }}
              <span class="ml-1 text-xs opacity-75">{{ tag.count }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
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

// 計算熱門分類（取前5個）
const topCategories = computed(() => {
  if (!allArticles.value) return []
  
  const categoryMap = new Map<string, number>()
  
  allArticles.value.forEach(article => {
    if (article.category) {
      const count = categoryMap.get(article.category) || 0
      categoryMap.set(article.category, count + 1)
    }
  })
  
  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

// 計算熱門標籤（取前8個）
const topTags = computed(() => {
  if (!allArticles.value) return []
  
  const tagMap = new Map<string, number>()
  
  allArticles.value.forEach(article => {
    if (article.tags && Array.isArray(article.tags)) {
      article.tags.forEach(tag => {
        const count = tagMap.get(tag) || 0
        tagMap.set(tag, count + 1)
      })
    }
  })
  
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

// 設定 SEO meta
const { setHomeMeta, setLanguage, setCanonicalUrl, setArticleListSchema } = useSEO()

// 設定首頁 SEO
setHomeMeta()
setLanguage('zh-TW')
setCanonicalUrl('/')

// 設定文章列表結構化資料
if (allArticles.value) {
  setArticleListSchema(allArticles.value.slice(0, 10), 'blog')
}
</script>
