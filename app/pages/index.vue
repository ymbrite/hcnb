<template>
  <div class="min-h-screen">
    <!-- 英雄區域 -->
    <section class="relative section-padding overflow-hidden">
      <div class="absolute inset-0 gradient-bg opacity-5"></div>
      <div class="container-custom relative z-10">
        <div class="text-center fade-in-up">
          <div class="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            基於 Nuxt v4 構建
          </div>
          
          <h1 class="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 text-balance">
            歡迎來到
            <span class="gradient-text">Markdown 部落格</span>
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed text-balance">
            現代化的部落格平台，專注於優質內容分享與技術交流，讓每一篇文章都能觸動人心
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink to="/blog" class="btn btn-primary btn-lg shadow-glow">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              探索文章
            </NuxtLink>
            <NuxtLink to="/blog/category/技術" class="btn btn-secondary btn-lg">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              技術專區
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 精選文章 -->
    <section class="section-padding-sm bg-white dark:bg-gray-800/50">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-12">
          <div class="slide-in-left">
            <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">精選文章</h2>
            <p class="text-gray-600 dark:text-gray-400">發現最受歡迎的優質內容</p>
          </div>
          <NuxtLink 
            to="/blog" 
            class="btn btn-ghost slide-in-right group"
          >
            查看全部
            <svg class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>
      
        <div class="fade-in">
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
        </div>
      </div>
    </section>

    <!-- 快速導航 -->
    <section class="section-padding-sm">
      <div class="container-custom">
        <div class="text-center mb-12 fade-in-up">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">探索內容</h2>
          <p class="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            透過分類和標籤快速找到您感興趣的內容，開啟知識探索之旅
          </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 分類導航 -->
          <div class="card card-hover slide-in-left">
            <div class="card-content">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">文章分類</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">按主題瀏覽內容</p>
                  </div>
                </div>
                <NuxtLink 
                  to="/blog/category" 
                  class="btn btn-ghost btn-sm group"
                >
                  查看全部
                  <svg class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </NuxtLink>
              </div>
              
              <div class="space-y-2">
                <NuxtLink
                  v-for="category in topCategories"
                  :key="category.name"
                  :to="`/blog/category/${encodeURIComponent(category.name)}`"
                  class="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                >
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                    <span class="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-medium">
                      {{ category.name }}
                    </span>
                  </div>
                  <span class="tag tag-secondary">
                    {{ category.count }}
                  </span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- 熱門標籤 -->
          <div class="card card-hover slide-in-right">
            <div class="card-content">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">熱門標籤</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">探索相關主題</p>
                  </div>
                </div>
                <NuxtLink 
                  to="/blog/tag" 
                  class="btn btn-ghost btn-sm group"
                >
                  查看全部
                  <svg class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </NuxtLink>
              </div>
              
              <UITagCloud 
                :tags="topTags" 
                :limit="8" 
                :show-count="true"
                color-scheme="default"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新文章 -->
    <section class="section-padding-sm bg-white dark:bg-gray-800/50">
      <div class="container-custom">
        <div class="flex items-center justify-between mb-12">
          <div class="slide-in-left">
            <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">最新文章</h2>
            <p class="text-gray-600 dark:text-gray-400">掌握最新動態與趨勢</p>
          </div>
          <NuxtLink 
            to="/blog" 
            class="btn btn-ghost slide-in-right group"
          >
            查看全部
            <svg class="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </NuxtLink>
        </div>
        
        <div class="fade-in">
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
        </div>
      </div>
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
const { setHomeMeta, setLanguage, setCanonicalUrl } = useSEO()

// 設定首頁 SEO
setHomeMeta()
setLanguage('zh-TW')
setCanonicalUrl('/')
</script>
