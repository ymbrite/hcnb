<template>
  <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Markdown 部落格
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            to="/" 
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            :class="{ 'text-blue-600 dark:text-blue-400': $route.path === '/' }"
          >
            首頁
          </NuxtLink>
          <NuxtLink 
            to="/blog" 
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            :class="{ 'text-blue-600 dark:text-blue-400': $route.path.startsWith('/blog') }"
          >
            文章
          </NuxtLink>
          
          <!-- 分類下拉選單 -->
          <div class="relative group">
            <button class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium flex items-center">
              分類
              <svg class="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div class="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div class="py-2">
                <NuxtLink 
                  to="/blog/category/技術"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  技術文章
                </NuxtLink>
                <NuxtLink 
                  to="/blog/category/生活"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  生活分享
                </NuxtLink>
                <NuxtLink 
                  to="/blog/category/教學"
                  class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  教學指南
                </NuxtLink>
              </div>
            </div>
          </div>
        </nav>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">
          <!-- Search Box (Desktop) -->
          <div class="hidden lg:block w-64">
            <UISearchBox />
          </div>
          
          <!-- Theme Toggle -->
          <UIThemeToggle />
          
          <!-- Mobile menu button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="開啟選單"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="isMobileMenuOpen" class="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
        <!-- Mobile Search -->
        <div class="mb-4 lg:hidden">
          <UISearchBox />
        </div>
        
        <nav class="flex flex-col space-y-2">
          <NuxtLink 
            to="/" 
            @click="closeMobileMenu"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            :class="{ 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20': $route.path === '/' }"
          >
            首頁
          </NuxtLink>
          <NuxtLink 
            to="/blog" 
            @click="closeMobileMenu"
            class="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            :class="{ 'text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20': $route.path.startsWith('/blog') }"
          >
            文章
          </NuxtLink>
          
          <!-- 行動版分類 -->
          <div class="px-4 py-2">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              分類
            </h3>
            <div class="space-y-1 ml-2">
              <NuxtLink 
                to="/blog/category/技術"
                @click="closeMobileMenu"
                class="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
              >
                技術文章
              </NuxtLink>
              <NuxtLink 
                to="/blog/category/生活"
                @click="closeMobileMenu"
                class="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
              >
                生活分享
              </NuxtLink>
              <NuxtLink 
                to="/blog/category/教學"
                @click="closeMobileMenu"
                class="block text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
              >
                教學指南
              </NuxtLink>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 監聽路由變化，關閉行動選單
const route = useRoute()
watch(() => route.path, () => {
  closeMobileMenu()
})

// 監聽 ESC 鍵關閉選單
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMobileMenu()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
