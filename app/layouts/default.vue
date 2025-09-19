<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <LayoutHeader />
    
    <main class="flex-1">
      <slot />
    </main>
    
    <LayoutFooter />
  </div>
</template>

<script setup lang="ts">
// 設定全域 SEO
const { setHomeMeta } = useSEO()

// 只在首頁設定首頁 meta
const route = useRoute()
if (route.path === '/') {
  setHomeMeta()
}
</script>
