<template>
  <footer class="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 網站資訊 -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Markdown 部落格
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            使用 Nuxt v4 建立的現代化部落格網站，支援 Markdown 文章、語法高亮、響應式設計和 SEO 優化。
          </p>
        </div>

        <!-- 快速連結 -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            快速連結
          </h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink 
                to="/" 
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                首頁
              </NuxtLink>
            </li>
            <li>
              <NuxtLink 
                to="/blog" 
                class="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                所有文章
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 技術資訊 -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            技術支援
          </h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li class="flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Nuxt v4
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Vue 3.5
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              TypeScript
            </li>
            <li class="flex items-center">
              <span class="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
              Tailwind CSS
            </li>
          </ul>
        </div>
      </div>

      <!-- 版權資訊 -->
      <div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            © {{ currentYear }} Markdown 部落格. 保留所有權利.
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 md:mt-0">
            使用 ❤️ 和 Nuxt v4 建立
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
