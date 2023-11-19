// 封装购物车模块
// 由于购物车数据的特殊性，采取pinia管理购物车列表数据并添加持久化缓存
// 整个购物车的实现分为两个大分支(未登录走本地购物车操作，登录走接口购物车操作)
// 1.本地购物车操作：所有操作不走接口直接操作pinia中的本地购物车列表
// 2.接口购物车操作：所有操作直接走接口，操作完毕获取购物车列表更新本地购物车列表
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserStore } from './userStore'
import { insertCartAPI, findNewCartListAPI, delCartAPI } from '@/apis/cart'
export const useCartStore = defineStore('cart', () => {
  const userStore = useUserStore()
  const isLogin = computed(() => userStore.userInfo.token)
  // 1. 定义state - cartList
  const cartList = ref([])
  
  // 获取最新购物车列表action
  const updateNewList = async () => {
    const res = await findNewCartListAPI()
    cartList.value = res.result
  }
  // 2. 定义action - addCart
  const addCart = async (goods) => {
    const { skuId, count } = goods
      // 登录时调用接口
    if (isLogin.value) {
      // 登录之后的加入购物车逻辑
      await insertCartAPI({ skuId, count })
      updateNewList()
      // 非登录时操作本地
    } else {
      // 添加购物车操作
      // 已添加过 - count + 1
      // 没有添加过 - 直接push
      // 思路：通过匹配传递过来的商品对象中的skuId能不能在cartList中找到，找到了就是添加过
      const item = cartList.value.find((item) => goods.skuId === item.skuId)
      if (item) {
        // 找到了(即重复的商品规格 上一次已经添加了 所以再次添加只是数量加一)
        item.count++
      } else {
        // 没找到(即新加入的商品规格)
        cartList.value.push(goods)
      }
    }
  }

  // 删除购物车
  const delCart = async (skuId) => {
    if (isLogin.value) {
      // 调用接口实现接口购物车中的删除功能
      await delCartAPI([skuId])
      updateNewList()
    } else {
      // 思路：
      // 1. 找到要删除项的下标值 - splice(里面的deleteCount参数,如果为0,即只进行插入操作,为1,即删除index下的元素)
      // 2. 使用数组的过滤方法 - filter
      const idx = cartList.value.findIndex((item) => skuId === item.skuId)
      cartList.value.splice(idx, 1)
    }
  }

  // 清除购物车
  const clearCart = () => {
    cartList.value = []
  }

  // 单选功能
  // 单选框核心思路：就是始终把单选框的状态和pinia中store对应的状态保持同步
  // 标记是否选中的字段为selected
  // 注意事项：v-model双向绑定指令不方便进行命令式的操作(因为后续还需要调用接口)
  // 所以把v-model回退到一般模式，也就是:model-value和@change的配合实现
  const singleCheck = (skuId, selected) => {
    // 通过skuId找到要修改的那一项 然后把它的selected修改为传过来的selected
    const item = cartList.value.find((item) => item.skuId === skuId)
    item.selected = selected
  }

  // 全选功能
  // 全选思路：1.操作单选决定全选：只有当cartList中的所有项都为true时，全选状态才为true
  // 2.操作全选决定单选：cartList中的所有项的selected都要跟着一起变
  const allCheck = (selected) => {
    // 把cartList中的每一项的selected都设置为当前的全选框状态
    cartList.value.forEach(item => item.selected = selected)
  }

  // 计算属性
  // 1. 总的数量 所有项的count之和
  //reduce方法用于对数组中的所有元素进行累积计算，最终返回一个值 这里的0是初始值
  const allCount = computed(() => cartList.value.reduce((a, c) => a + c.count, 0))
  // 2. 总价 所有项的count*price之和
  const allPrice = computed(() => cartList.value.reduce((a, c) => a + c.count * c.price, 0))

  // 3. 已选择数量 = cartList中所有selected字段为true项的count之和
  const selectedCount = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count, 0))
  // 4. 已选择商品价钱合计 = cartList中所有selected字段为true项的count*price之和
  const selectedPrice = computed(() => cartList.value.filter(item => item.selected).reduce((a, c) => a + c.count * c.price, 0))

  // 是否全选
  // every()方法会遍历数组中的每个元素，并对每个元素执行指定的条件判断函数
  // 如果数组中的每个元素都满足已选择条件，every()方法会返回true；否则返回false
  const isAll = computed(() => cartList.value.every((item) => item.selected))

  return {
    cartList,
    allCount,
    allPrice,
    isAll,
    selectedCount,
    selectedPrice,
    clearCart,
    addCart,
    delCart,
    singleCheck,
    allCheck,
    updateNewList
  }
}, {
  persist: true,
})