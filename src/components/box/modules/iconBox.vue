<script setup>
import {tool} from "@/utils/index.js"
import {onMounted, onUnmounted, ref, watch} from "vue";

import {WeatherShower} from "@/components/icon/index.js";

const props = defineProps({
  color: {
    type: String,
    default: null
  },
  listen: {
    type: String,
    default: 'false'
  }
})

let box = null

const iconBox = ref(null)

class IconBox {
  constructor(color, listen) {
    this.iconBox = tool.refToDom(iconBox)
    this.cssListener = null
    this.listen = listen
    this.color = color === null ? null : color

    this.init()
  }

  init() {
    if (this.color === null) {
      this.update_color()
      if (this.listen === 'true') this.add_event()
    } else this.set_fill_for_child()
  }

  update_color = () => {
    this.get_color_from_parent()
    this.set_fill_for_child()
  }

  get_color_from_parent = () => {
    this.color = tool.getCssDom(this.iconBox.parentElement, 'color')
  }

  set_fill_for_child = () => {
    this.iconBox.querySelectorAll('path').forEach((item) => {
      item.style.fill = this.color
    })
  }

  add_event() {
    this.cssListener = new tool.CssListener({
      dom: this.iconBox,
      prop: ['color'],
      func: this.update_color,
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
  return new IconBox(props.color, props.listen)
}

watch(() => props.color, () => {
  box = createBox()
})

onMounted(() => {
  box = createBox()
})

onUnmounted(() => {
  if (props.listen === 'true') box.cssListener.clear_listener()
})
</script>

<template>
  <div class="iconBox" ref="iconBox">
    <slot>
      <WeatherShower></WeatherShower>
    </slot>
  </div>
</template>

<style>
.iconBox {
  width: 100%;
  height: 100%;
  position: relative;
}

.iconBox svg {
  width: 100%;
  height: 100%;
}
</style>