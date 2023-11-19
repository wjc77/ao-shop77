// main.js入口文件优化：
// 入口文件通常只做一些初始化的事情，不应该包含太多的逻辑代码
// 通过插件的方法把懒加载指令封装为插件
// main.js入口文件只需要负责注册插件即可

//导入tailwindcss
import './assets/main.css'
import '../dist/tailwind.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 持久化用户数据说明：
// 1.用户数据有一个关键的数据叫做Token(用来标识当前用户是否登录)，而Token持续一段时间才会过期
// 2.pinia的存储是基于内存的，刷新就丢失，为了保持登录状态就要做到刷新不丢失，需要配合持久化进行存储，该插件就是适用于pinia的持久化存储插件
// 目的：保持token不丢失，保持登录状态
// 最终效果：操作state时会自动把用户数据在本地的localStorage也存一份，刷新的时候会从localStorage先获取
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

// 引入初始化样式文件
import '@/styles/common.scss'

// 引入懒加载指令插件并且注册
import { lazyPlugin } from '@/directives'
// 引入全局组件插件
import { componentPlugin } from '@/components'

const app = createApp(App)
const pinia = createPinia()
// 注册持久化插件
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(lazyPlugin)
app.use(componentPlugin)
app.mount('#app')




