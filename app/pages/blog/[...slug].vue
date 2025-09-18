<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="text-center">
      載入中...
    </div>
    
    <div v-else-if="error" class="text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">文章不存在</h1>
      <NuxtLink to="/blog" class="text-blue-600 hover:underline">
        返回文章列表
      </NuxtLink>
    </div>
    
    <article v-else class="max-w-4xl mx-auto">
      <!-- 文章標題 -->
      <header class="mb-8">
        <h1 class="text-4xl font-bold mb-4">{{ data.title }}</h1>
        
        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <span>{{ formatDate(data.publishedAt) }}</span>
          <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
            {{ data.category }}
          </span>
          <span v-if="data.author">作者：{{ data.author }}</span>
        </div>
        
        <div v-if="data.tags && data.tags.length" class="flex flex-wrap gap-2">
          <span 
            v-for="tag in data.tags" 
            :key="tag"
            class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm"
          >
            #{{ tag }}
          </span>
        </div>
      </header>
      
      <!-- 文章內容 -->
      <div class="prose-custom">
        <ContentRenderer :value="data" />
      </div>
      
      <!-- 返回連結 -->
      <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <NuxtLink 
          to="/blog" 
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← 返回文章列表
        </NuxtLink>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string[]

// 查詢文章內容
const { data, pending, error } = await queryContent('blog', ...slug).findOne()

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 設定頁面 meta
if (data.value) {
  useSeoMeta({
    title: `${data.value.title} - Markdown 部落格`,
    description: data.value.description
  })
}
</script>
