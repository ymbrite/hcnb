<template>
  <article class="max-w-4xl mx-auto">
    <!-- 文章標題區域 -->
    <header class="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
      <!-- 分類標籤 -->
      <div class="mb-4">
        <NuxtLink 
          :to="`/blog/category/${encodeURIComponent(article.category)}`"
          class="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          {{ article.category }}
        </NuxtLink>
      </div>
      
      <!-- 文章標題 -->
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
        {{ article.title }}
      </h1>
      
      <!-- 文章描述 -->
      <p v-if="article.description" class="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {{ article.description }}
      </p>
      
      <!-- 文章元數據 -->
      <div class="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
        <!-- 發布日期 -->
        <div class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>發布於 {{ formatDate(article.publishedAt) }}</span>
        </div>
        
        <!-- 更新日期 -->
        <div v-if="article.updatedAt && article.updatedAt !== article.publishedAt" class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>更新於 {{ formatDate(article.updatedAt) }}</span>
        </div>
        
        <!-- 作者 -->
        <div v-if="article.author" class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{{ article.author }}</span>
        </div>
        
        <!-- 閱讀時間 -->
        <div v-if="article.readingTime" class="flex items-center">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ article.readingTime.text }}</span>
        </div>
      </div>
      
      <!-- 標籤 -->
      <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-2 mt-6">
        <NuxtLink
          v-for="tag in article.tags"
          :key="tag"
          :to="`/blog/tag/${encodeURIComponent(tag)}`"
          class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          #{{ tag }}
        </NuxtLink>
      </div>
    </header>
    
    <!-- 文章內容區域 -->
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- 主要內容 -->
      <div class="flex-1 min-w-0">
        <!-- 文章封面圖 -->
        <div v-if="article.image" class="mb-8">
          <div class="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden aspect-video">
            <NuxtImg
              :src="article.image"
              :alt="article.title"
              class="w-full h-full object-cover rounded-lg shadow-lg"
              loading="lazy"
              sizes="sm:100vw md:100vw lg:75vw xl:60vw"
              format="webp"
              quality="85"
              placeholder
              @error="handleImageError"
            />
            <!-- 圖片載入失敗時的佔位圖 -->
            <div class="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500" style="display: none;" ref="placeholderRef">
              <div class="text-center">
                <svg class="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm">圖片載入失敗</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Markdown 內容 -->
        <div class="prose-custom">
          <ContentRenderer :value="article" />
        </div>
        
        <!-- 文章底部操作 -->
        <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <!-- 分享按鈕 -->
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">分享文章：</span>
              <div class="flex space-x-2">
                <button
                  @click="shareToTwitter"
                  class="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                  title="分享到 Twitter"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button
                  @click="shareToFacebook"
                  class="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  title="分享到 Facebook"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  @click="copyLink"
                  class="p-2 text-gray-500 hover:text-green-600 transition-colors"
                  title="複製連結"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- 返回按鈕 -->
            <NuxtLink 
              to="/blog" 
              class="btn-secondary"
            >
              ← 返回文章列表
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- 側邊欄 (目錄) -->
      <aside v-if="showToc && article.body?.toc?.links?.length" class="lg:w-64 flex-shrink-0">
        <div class="sticky top-24">
          <BlogTableOfContents :toc="article.body.toc.links" />
        </div>
      </aside>
    </div>
  </article>
</template>

<script setup lang="ts">
interface ArticleContentProps {
  article: {
    title: string
    description?: string
    publishedAt: string
    updatedAt?: string
    category: string
    tags?: string[]
    author?: string
    image?: string
    body: any
    readingTime?: {
      text: string
      minutes: number
      time: number
      words: number
    }
  }
  showToc?: boolean
}

const props = withDefaults(defineProps<ArticleContentProps>(), {
  showToc: true
})

const { formatDate } = useContentUtils()
const route = useRoute()

// 處理圖片載入錯誤
const placeholderRef = ref<HTMLElement>()
const handleImageError = (payload: string | Event) => {
  // 如果是 Event 對象，處理 DOM 元素
  if (payload instanceof Event) {
    const img = payload.target as HTMLImageElement
    if (img && placeholderRef.value) {
      img.style.display = 'none'
      placeholderRef.value.style.display = 'flex'
    }
  }
  // 如果是字符串，記錄錯誤信息
  else if (typeof payload === 'string') {
    console.warn('Image loading error:', payload)
    // 如果有佔位符元素，也顯示它
    if (placeholderRef.value) {
      placeholderRef.value.style.display = 'flex'
    }
  }
}

// 分享功能
const shareToTwitter = () => {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.article.title)}&url=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const shareToFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
  window.open(url, '_blank', 'width=600,height=400')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    // 這裡可以加入通知提示
    console.log('連結已複製到剪貼簿')
  } catch (err) {
    console.error('複製連結失敗:', err)
  }
}
</script>
