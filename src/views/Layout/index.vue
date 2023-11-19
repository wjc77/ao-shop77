<script setup>

import LayoutNav from './components/LayoutNav.vue'
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutFooter from './components/LayoutFooter.vue'
import LayoutFixed from './components/LayoutFixed.vue'

// 触发获取导航列表的action

import { useCategoryStore } from '@/stores/categoryStore'
import { onMounted } from 'vue'

const categoryStore = useCategoryStore()

onMounted(() => categoryStore.getCategory())
</script>

<template>
  <LayoutFixed />
  <LayoutNav />
  <LayoutHeader />
    <!-- 二级路由出口 -->
  <!-- 解决路由缓存问题 <RouterView :key="$route.fullPath"/>  通过添加key 破坏复用机制 强制销毁重建
    此方法有个缺点即轮播图重新发送请求了   'vue官网响应路由参数的变化'-->
    <!-- 扩展：路由缓存问题产生的原因为："路由只有参数(这边是category.js里的id)变化时，会复用组件实例 
      意味着组件的生命周期钩子函数(这里即为Category下的index.vue里的onMounted不会被调用)不会被调用" -->
  <RouterView />
  <LayoutFooter />
</template>