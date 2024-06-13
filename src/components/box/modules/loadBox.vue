<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {tool} from "@/utils/index.js";
import RotatingPoint from "@/components/loader/modules/rotatingPoint.vue";

const props = defineProps({
  listen: {
    type: String,
    default: 'false'
  }
})


let box = null

const loadBox = ref(null)
const wrapper = ref(null)

class LoadBox {
  constructor(listen) {
    this.listen = listen
    this.loadBox = tool.refToDom(loadBox)
    this.wrapper = tool.refToDom(wrapper)

    this.distance = {}
    this.cssListener = null

    this.init()
  }

  init() {
    this.adjust_wrapper()
    if(this.listen === 'true') this.add_event()
  }

  adjust_wrapper = () => {
    const loadBoxRect = tool.getDomRect(this.loadBox)
    const wrapperRect = tool.getDomRect(this.wrapper)

    this.distance.topW = (loadBoxRect.height - wrapperRect.height) / 2
    this.distance.leftW = (loadBoxRect.width - wrapperRect.width) / 2

    tool.setStyle(this.wrapper, {'top': `${this.distance.topW}px`, 'left': `${this.distance.leftW}px`})

  }

  add_event = () => {
    this.cssListener = new tool.CssListener({
      dom: this.loadBox,
      prop: ['width', 'height'],
      func: this.adjust_wrapper,
      space: 200
    })

    this.cssListener.start_listener()
  }
}

const control = (state) => {
  if (box.listen === 'false') throw new Error('无法启动或关闭,你需要将listen设置为"true"')
  if (state) box.cssListener.start_listener()
  else box.cssListener.clear_listener()
}

defineExpose({
  control
})

const createBox = () => {
  return new LoadBox(props.listen)
}

onMounted(() => {
  box = createBox()
})

onUnmounted(()=>{
  if (props.listen === 'true') box.cssListener.clear_listener()
})
</script>

<template>
  <div class="loadBox" ref="loadBox">
    <div class="wrapper" ref="wrapper">
      <slot>
        <rotating-point></rotating-point>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.loadBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px black solid;
}

.loadBox .wrapper {
  position: relative;
  top: 0;
  left: 0;
  width: fit-content;
  height: fit-content;
}
</style>