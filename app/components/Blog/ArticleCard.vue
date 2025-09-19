<template>
  <article
    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 card-hover"
  >
    <!-- 文章圖片 -->
    <div v-if="showImage" class="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <NuxtImg
        v-if="article.image"
        :src="article.image"
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
        sizes="sm:100vw md:50vw lg:33vw"
        @error="handleImageError"
      />
      <!-- 預設 SVG 佔位圖 -->
      <div v-else class="text-gray-400 dark:text-gray-500">
        <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- 文章內容 -->
    <div class="p-6">
      <!-- 分類標籤 -->
      <div class="flex items-center justify-between mb-3">
        <NuxtLink
          :to="`/blog/category/${encodeURIComponent(article.category)}`"
          class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          {{ article.category }}
        </NuxtLink>

        <!-- 閱讀時間 -->
        <span v-if="article.readingTime" class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ article.readingTime.text }}
        </span>
      </div>

      <!-- 文章標題 -->
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
        <NuxtLink :to="article._path" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          {{ article.title }}
        </NuxtLink>
      </h2>

      <!-- 文章摘要 -->
      <p v-if="showExcerpt && article.description" class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {{ article.description }}
      </p>

      <!-- 文章元數據 -->
      <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div class="flex items-center space-x-4">
          <!-- 發布日期 -->
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {{ formatDate(article.publishedAt) }}
          </span>

          <!-- 作者 -->
          <span v-if="article.author" class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {{ article.author }}
          </span>
        </div>

        <!-- 閱讀更多按鈕 -->
        <NuxtLink
          :to="article._path"
          class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          閱讀更多 →
        </NuxtLink>
      </div>

      <!-- 標籤 -->
      <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mt-4">
        <NuxtLink
          v-for="tag in article.tags.slice(0, 3)"
          :key="tag"
          :to="`/blog/tag/${encodeURIComponent(tag)}`"
          class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          #{{ tag }}
        </NuxtLink>
        <span v-if="article.tags.length > 3" class="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
          +{{ article.tags.length - 3 }} 更多
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
interface ArticleCardProps {
  article: {
    _path: string
    title: string
    description?: string
    publishedAt: string
    category: string
    tags?: string[]
    image?: string
    author?: string
    readingTime?: {
      text: string
      minutes: number
      time: number
      words: number
    }
  }
  showExcerpt?: boolean
  showImage?: boolean
}

const props = withDefaults(defineProps<ArticleCardProps>(), {
  showExcerpt: true,
  showImage: true,
})

const { formatDate } = useContentUtils()

// 處理圖片載入錯誤
const handleImageError = (payload: string | Event) => {
  // 如果是 Event 對象，處理 DOM 元素
  if (payload instanceof Event) {
    const img = payload.target as HTMLImageElement
    if (img) {
      img.style.display = 'none'
    }
  }
  // 如果是字符串，記錄錯誤信息
  else if (typeof payload === 'string') {
    console.warn('Image loading error:', payload)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
