<template>
  <nav class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
      目錄
    </h3>
    
    <div class="space-y-1 max-h-96 overflow-y-auto">
      <div
        v-for="item in flattenedToc"
        :key="item.id"
        :style="{ paddingLeft: `${(item.depth - 1) * 16}px` }"
      >
        <a
          :href="`#${item.id}`"
          @click.prevent="scrollToHeading(item.id)"
          :class="[
            'block py-2 px-3 rounded-md text-sm transition-colors',
            activeId === item.id
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          {{ item.text }}
        </a>
      </div>
    </div>
    
    <!-- 進度條 -->
    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>閱讀進度</span>
        <span>{{ Math.round(readingProgress) }}%</span>
      </div>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          class="bg-blue-600 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${readingProgress}%` }"
        ></div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface TocItem {
  id: string
  text: string
  depth: number
  children?: TocItem[]
}

interface TableOfContentsProps {
  toc: TocItem[]
}

const props = defineProps<TableOfContentsProps>()

// 當前活躍的標題 ID
const activeId = ref('')

// 閱讀進度
const readingProgress = ref(0)

// 扁平化目錄結構
const flattenedToc = computed(() => {
  const flatten = (items: TocItem[]): TocItem[] => {
    const result: TocItem[] = []
    for (const item of items) {
      result.push(item)
      if (item.children && item.children.length > 0) {
        result.push(...flatten(item.children))
      }
    }
    return result
  }
  return flatten(props.toc)
})

// 滾動到指定標題
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 100 // 頂部偏移量
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = elementPosition - offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// 監聽滾動事件，更新活躍標題和閱讀進度
onMounted(() => {
  const updateActiveHeading = () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const scrollTop = window.pageYOffset
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    
    // 更新閱讀進度
    readingProgress.value = Math.min(100, (scrollTop / (documentHeight - windowHeight)) * 100)
    
    // 找到當前可見的標題
    let currentActiveId = ''
    
    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i] as HTMLElement
      const rect = heading.getBoundingClientRect()
      
      if (rect.top <= 150) { // 150px 的偏移量
        currentActiveId = heading.id
        break
      }
    }
    
    activeId.value = currentActiveId
  }
  
  // 初始化
  updateActiveHeading()
  
  // 監聽滾動事件
  window.addEventListener('scroll', updateActiveHeading, { passive: true })
  
  // 清理事件監聽器
  onUnmounted(() => {
    window.removeEventListener('scroll', updateActiveHeading)
  })
})
</script>


