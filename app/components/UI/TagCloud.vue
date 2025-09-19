<template>
  <div class="tag-cloud">
    <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {{ title }}
    </h3>
    
    <div class="flex flex-wrap gap-2">
      <NuxtLink
        v-for="tag in displayTags"
        :key="tag.name"
        :to="`/blog/tag/${encodeURIComponent(tag.name)}`"
        :class="getTagClasses(tag.count)"
        class="inline-flex items-center px-3 py-1 rounded-full transition-all duration-200 hover:scale-105"
      >
        #{{ tag.name }}
        <span v-if="showCount" class="ml-1 text-xs opacity-75">
          {{ tag.count }}
        </span>
      </NuxtLink>
    </div>
    
    <!-- 顯示更多按鈕 -->
    <div v-if="tags.length > limit && !showAll" class="mt-4 text-center">
      <button
        @click="showAll = true"
        class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
      >
        顯示更多標籤 ({{ tags.length - limit }})
      </button>
    </div>
    
    <!-- 收起按鈕 -->
    <div v-if="showAll && tags.length > limit" class="mt-4 text-center">
      <button
        @click="showAll = false"
        class="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium transition-colors"
      >
        收起標籤
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tag {
  name: string
  count: number
}

interface TagCloudProps {
  tags: Tag[]
  title?: string
  limit?: number
  showCount?: boolean
  colorScheme?: 'default' | 'rainbow' | 'monochrome'
}

const props = withDefaults(defineProps<TagCloudProps>(), {
  title: '',
  limit: 20,
  showCount: true,
  colorScheme: 'default'
})

const showAll = ref(false)

// 計算顯示的標籤
const displayTags = computed(() => {
  const sortedTags = [...props.tags].sort((a, b) => b.count - a.count)
  return showAll.value ? sortedTags : sortedTags.slice(0, props.limit)
})

// 獲取標籤樣式類別
const getTagClasses = (count: number): string => {
  const maxCount = Math.max(...props.tags.map(tag => tag.count))
  const minCount = Math.min(...props.tags.map(tag => tag.count))
  const ratio = maxCount > minCount ? (count - minCount) / (maxCount - minCount) : 0.5
  
  if (props.colorScheme === 'rainbow') {
    return getRainbowClasses(ratio)
  } else if (props.colorScheme === 'monochrome') {
    return getMonochromeClasses(ratio)
  } else {
    return getDefaultClasses(ratio)
  }
}

// 預設配色方案
const getDefaultClasses = (ratio: number): string => {
  const baseClasses = 'text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300'
  
  if (ratio >= 0.8) {
    return `${baseClasses} bg-blue-100 dark:bg-blue-900 text-lg font-bold`
  } else if (ratio >= 0.6) {
    return `${baseClasses} bg-blue-50 dark:bg-blue-800 text-base font-semibold`
  } else if (ratio >= 0.4) {
    return `${baseClasses} bg-gray-100 dark:bg-gray-700 text-sm font-medium`
  } else if (ratio >= 0.2) {
    return `${baseClasses} bg-gray-50 dark:bg-gray-800 text-sm`
  } else {
    return `${baseClasses} bg-gray-50 dark:bg-gray-800 text-xs`
  }
}

// 彩虹配色方案
const getRainbowClasses = (ratio: number): string => {
  const colors = [
    'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800',
    'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800',
    'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800',
    'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800',
    'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800',
    'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800',
    'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800',
  ]
  
  const colorIndex = Math.floor(ratio * (colors.length - 1))
  const sizeClass = ratio >= 0.7 ? 'text-lg font-bold' : ratio >= 0.4 ? 'text-base font-semibold' : 'text-sm'
  
  return `${colors[colorIndex]} ${sizeClass}`
}

// 單色配色方案
const getMonochromeClasses = (ratio: number): string => {
  const baseClasses = 'text-gray-700 dark:text-gray-300'
  
  if (ratio >= 0.8) {
    return `${baseClasses} bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-lg font-bold hover:bg-gray-700 dark:hover:bg-gray-300`
  } else if (ratio >= 0.6) {
    return `${baseClasses} bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900 text-base font-semibold hover:bg-gray-500 dark:hover:bg-gray-500`
  } else if (ratio >= 0.4) {
    return `${baseClasses} bg-gray-400 dark:bg-gray-600 text-white dark:text-gray-200 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-500`
  } else if (ratio >= 0.2) {
    return `${baseClasses} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm`
  } else {
    return `${baseClasses} bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs`
  }
}
</script>

<style scoped>
.tag-cloud {
  @apply w-full;
}
</style>
