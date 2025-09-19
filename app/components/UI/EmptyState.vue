<template>
  <div class="empty-state text-center py-12 px-4">
    <!-- 圖示 -->
    <div class="mb-6">
      <div class="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
        <!-- 自定義圖示 -->
        <slot name="icon">
          <!-- 文章圖示 -->
          <svg v-if="type === 'no-articles'" class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          
          <!-- 搜尋圖示 -->
          <svg v-else-if="type === 'no-search-results'" class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <!-- 分類/標籤圖示 -->
          <svg v-else-if="type === 'no-category' || type === 'no-tag'" class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          
          <!-- 錯誤圖示 -->
          <svg v-else-if="type === 'error'" class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          
          <!-- 預設圖示 -->
          <svg v-else class="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </slot>
      </div>
    </div>
    
    <!-- 標題 -->
    <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
      {{ title }}
    </h3>
    
    <!-- 描述 -->
    <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
      {{ description }}
    </p>
    
    <!-- 操作按鈕 -->
    <div v-if="$slots.actions || actionButton" class="space-y-4">
      <slot name="actions">
        <NuxtLink
          v-if="actionButton"
          :to="actionButton.to"
          :class="[
            'inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors',
            actionButton.variant === 'secondary'
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          ]"
        >
          <component 
            v-if="actionButton.icon" 
            :is="actionButton.icon" 
            class="w-5 h-5 mr-2" 
          />
          {{ actionButton.text }}
        </NuxtLink>
      </slot>
    </div>
    
    <!-- 額外內容 -->
    <div v-if="$slots.extra" class="mt-8">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface ActionButton {
  text: string
  to: string
  variant?: 'primary' | 'secondary'
  icon?: any
}

interface EmptyStateProps {
  type?: 'no-articles' | 'no-search-results' | 'no-category' | 'no-tag' | 'error' | 'custom'
  title?: string
  description?: string
  actionButton?: ActionButton
}

const props = withDefaults(defineProps<EmptyStateProps>(), {
  type: 'custom',
  title: '',
  description: ''
})

// 根據類型獲取預設內容
const getDefaultContent = () => {
  switch (props.type) {
    case 'no-articles':
      return {
        title: '目前沒有文章',
        description: '還沒有發布任何文章。請稍後再來查看最新內容，或者瀏覽其他分類。'
      }
    case 'no-search-results':
      return {
        title: '沒有找到相關結果',
        description: '請嘗試使用不同的關鍵字搜尋，或者瀏覽所有文章來發現有趣的內容。'
      }
    case 'no-category':
      return {
        title: '此分類暫無文章',
        description: '這個分類下還沒有文章。請瀏覽其他分類或查看所有文章。'
      }
    case 'no-tag':
      return {
        title: '此標籤暫無文章',
        description: '這個標籤下還沒有文章。請瀏覽其他標籤或查看所有文章。'
      }
    case 'error':
      return {
        title: '載入失敗',
        description: '無法載入內容，請檢查網路連線或稍後再試。'
      }
    default:
      return {
        title: props.title || '暫無內容',
        description: props.description || '目前沒有可顯示的內容。'
      }
  }
}

// 計算實際顯示的標題和描述
const { title: defaultTitle, description: defaultDescription } = getDefaultContent()
const title = computed(() => props.title || defaultTitle)
const description = computed(() => props.description || defaultDescription)
</script>
