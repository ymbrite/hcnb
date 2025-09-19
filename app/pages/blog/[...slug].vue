<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="text-center">載入中...</div>

    <div v-else-if="error || !data" class="text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">文章不存在</h1>
      <p class="text-gray-600 mb-4">路徑: /blog/{{ slug.join('/') }}</p>
      <p class="text-gray-600 mb-4">錯誤: {{ error?.message || '文章未找到' }}</p>
      <NuxtLink to="/blog" class="text-blue-600 hover:underline"> 返回文章列表 </NuxtLink>
    </div>

    <BlogArticleContent 
      v-else
      :article="data" 
      :show-toc="true"
    />
  </div>
</template>

<script setup lang="ts">
// 使用 blog 佈局
definePageMeta({
  layout: 'blog',
})

const route = useRoute()
const slug = route.params.slug as string[]

// 查詢文章內容
const { data, pending, error } = await useAsyncData(`blog-${slug.join('-')}`, async () => {
  try {
    // 嘗試多種查詢方式
    const articlePath = `/blog/${slug.join('/')}`

    // 方法1: 直接路徑查詢
    let article = await queryContent()
      .where({ _path: articlePath })
      .findOne()
      .catch(() => null)

    if (!article) {
      // 方法2: 使用 slug 參數
      article = await queryContent('blog', ...slug)
        .findOne()
        .catch(() => null)
    }

    if (!article) {
      // 方法3: 查詢所有文章然後過濾
      const allArticles = await queryContent('blog').find()
      article = allArticles.find((a) => a._path === articlePath) || null
    }

    return article
  } catch (err) {
    console.error('查詢文章時發生錯誤:', err)
    throw err
  }
})

// 不再需要 formatDate，因為組件內部會處理

// 設定 SEO meta
const { setArticleMeta, setCanonicalUrl, setLanguage, setBreadcrumbSchema } = useSEO()

if (data.value) {
  // 設定文章 SEO meta
  setArticleMeta(data.value)
  
  // 設定 canonical URL
  setCanonicalUrl(data.value._path)
  
  // 設定語言
  setLanguage('zh-TW')
  
  // 設定麵包屑
  const breadcrumbs = [
    { name: '首頁', url: '/' },
    { name: '部落格', url: '/blog' },
  ]
  
  if (data.value.category) {
    breadcrumbs.push({
      name: data.value.category,
      url: `/blog/category/${slugify(data.value.category)}`,
    })
  }
  
  breadcrumbs.push({
    name: data.value.title,
    url: data.value._path,
  })
  
  setBreadcrumbSchema(breadcrumbs)
}
</script>
