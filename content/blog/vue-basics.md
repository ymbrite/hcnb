---
title: "Vue.js 基礎入門"
description: "從零開始學習 Vue.js，了解響應式資料、組件系統和基本語法。"
publishedAt: "2024-01-20"
updatedAt: "2024-01-21"
category: "前端開發"
tags: ["Vue", "JavaScript", "前端"]
author: "前端工程師"
image: "/images/vue-basics.jpg"
draft: false
featured: true
---

# Vue.js 基礎入門

Vue.js 是一個漸進式 JavaScript 框架，用於建立使用者介面。

## 什麼是 Vue.js？

Vue.js 是一個專注於視圖層的框架，它提供了：

- **響應式資料綁定**
- **組件化開發**
- **虛擬 DOM**
- **指令系統**

## 基本語法

### 資料綁定

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello Vue!',
      message: '這是我的第一個 Vue 應用程式'
    }
  }
}
</script>
```

### 條件渲染

```vue
<template>
  <div>
    <p v-if="show">這段文字會顯示</p>
    <p v-else>這段文字不會顯示</p>
  </div>
</template>
```

### 列表渲染

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>
```

### 事件處理

```vue
<template>
  <button @click="handleClick">點擊我</button>
</template>

<script>
export default {
  methods: {
    handleClick() {
      alert('按鈕被點擊了！')
    }
  }
}
</script>
```

## 組件系統

Vue.js 的核心概念之一就是組件化開發：

```vue
<!-- 父組件 -->
<template>
  <div>
    <UserCard :user="currentUser" @update="handleUpdate" />
  </div>
</template>

<!-- 子組件 UserCard.vue -->
<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
  </div>
</template>

<script>
export default {
  props: ['user'],
  emits: ['update']
}
</script>
```

## 生命週期

Vue 組件有完整的生命週期鉤子：

```javascript
export default {
  created() {
    console.log('組件已建立')
  },
  mounted() {
    console.log('組件已掛載到 DOM')
  },
  updated() {
    console.log('組件已更新')
  },
  destroyed() {
    console.log('組件已銷毀')
  }
}
```

## 結論

Vue.js 提供了簡潔而強大的 API，讓開發者能夠快速建立互動式的 web 應用程式。它的學習曲線相對平緩，是前端開發的絕佳選擇。

下一步可以學習：
- Vue Router（路由管理）
- Vuex/Pinia（狀態管理）
- Vue CLI（開發工具）
