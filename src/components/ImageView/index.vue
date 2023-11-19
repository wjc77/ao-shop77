<!-- 详情页图片预览组件 -->
<script setup>
import { ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'

// props适配图片列表
//复习：defineProps() 方法，用于定义组件的属性（props）。
//其中，imageList 是一个属性名，它的类型是数组（Array），默认值是一个空数组（() => []）。
//这意味着当该组件被使用时，可以通过传递一个名为 imageList 的属性来对其进行配置。在组件内部，可以通过 this.imageList 访问该属性的值。
defineProps({
  imageList: {
    type: Array,
    default: () => []
  }
})


// 1.小图切换大图显示
const activeIndex = ref(0)

const enterhandler = (i) => {
  activeIndex.value = i
}

// 2. 获取鼠标相对位置
const target = ref(null)
//使用useMouseInElement里面的三个参数：
//elementX：鼠标相对于盒子左侧的一个位置
//elementY：鼠标相对于盒子顶部的一个位置
//isOutside：判断鼠标是否进入盒子内
const { elementX, elementY, isOutside } = useMouseInElement(target)

//3.放大镜效果实现-滑块跟随鼠标移动
// 获取到当前的鼠标在盒子内的相对位置(useMouseInElement)，控制滑块跟随鼠标移动（监听elementX/Y变化，一旦变化 重新设置left/top）
const left = ref(0)
const top = ref(0)

const positionX = ref(0)
const positionY = ref(0)
watch([elementX, elementY, isOutside], () => {

  // 如果鼠标没有移入到盒子里面 直接不执行后面的逻辑
  if (isOutside.value) return

  // 有效范围内控制滑块距离
  // 横向
  if (elementX.value > 100 && elementX.value < 300) {
    left.value = elementX.value - 100 //减去小滑块宽度一半
  }
  // 纵向
  if (elementY.value > 100 && elementY.value < 300) {
    top.value = elementY.value - 100 //减去小滑块高度一半
  }

  // 处理边界
  if (elementX.value > 300) { left.value = 200 }
  if (elementX.value < 100) { left.value = 0 }

  if (elementY.value > 300) { top.value = 200 }
  if (elementY.value < 100) { top.value = 0 }

  // 控制大图的显示(大图的移动方向和滑块移动方向相反，且数值为2倍)
  positionX.value = -left.value * 2
  positionY.value = -top.value * 2

})

</script>


<template>
  <div class="goods-image">

    <!-- 左侧大图 middle类定义边长为400px的正方形-->
    <div class="middle" ref="target">
      <img :src="imageList[activeIndex]" alt="" />
      <!-- 蒙层小滑块 -->
      <div class="layer" v-show="!isOutside" :style="{ left: `${left}px`, top: `${top}px` }"></div>
    </div>
    <!-- 小图列表 -->
    <ul class="small">
      <!-- mouseenter鼠标事件，它在鼠标指针进入元素时触发。这个事件通常用于在用户将鼠标指针悬停在一个元素上时执行特定的操作 -->
      <!-- 动态类名控制：通过下标实现激活状态显示 -->
      <li v-for="(img, i) in imageList" :key="i" @mouseenter="enterhandler(i)" :class="{ active: i === activeIndex }">
        <img :src="img" alt="" />
      </li>
    </ul>
    <!-- 放大镜大图-->
    <div class="large" :style="[
      {
        backgroundImage: `url(${imageList[activeIndex]})`,
        backgroundPositionX: `${positionX}px`,
        backgroundPositionY: `${positionY}px`,
      },
    ]" v-show="!isOutside"></div>
  </div>
</template>

<style scoped lang="scss">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;

  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
  }

  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    z-index: 500;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    // 背景图:盒子的大小 = 2:1  将来控制背景图的移动来实现放大的效果查看 background-position
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }

  .layer {
    width: 200px;
    height: 200px;
    background: rgba(0, 0, 0, 0.2);
    // 绝对定位 然后跟随咱们鼠标控制left和top属性就可以让滑块移动起来
    left: 0;
    top: 0;
    position: absolute;
  }

  .small {
    width: 80px;

    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;

      &:hover,
      &.active {
        border: 2px solid $xtxColor;
      }
    }
  }
}
</style>