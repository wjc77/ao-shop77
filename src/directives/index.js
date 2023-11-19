// 定义懒加载插件
//提供了一个用于观察元素与其祖先元素或视口之间交叉的响应式API
import { useIntersectionObserver } from '@vueuse/core'
//自定义懒加载插件 里面包含懒加载全局指令
export const lazyPlugin = {
  install (app) {
    // 懒加载指令逻辑
    app.directive('img-lazy', {
      mounted (el, binding) {
        // el: 指令绑定的那个元素 img
        // binding: binding.value  指令等于号后面绑定的表达式的值  图片url
        // console.log(el, binding.value)
        //通过接受stop方法解决重复监听问题(存在内存浪费)
        const { stop } = useIntersectionObserver(
          el, //监听el vueuse官网详细查看
          //isIntersecting判断是否进入视口区域
          ([{ isIntersecting }]) => {
            console.log(isIntersecting)
            if (isIntersecting) {
              //当图片进入视口区域 发送图片资源请求
              el.src = binding.value
              stop()
            }
          },
        )
      }
    })
  }
}