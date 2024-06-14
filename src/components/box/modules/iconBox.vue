<script setup>
import {tool} from "@/utils/index.js"
import {onMounted, onUnmounted, ref, watch} from "vue";

import {WeatherShower, WeatherSnow} from "@/components/icon/index.js";

const props = defineProps({
  color: {
    type: String,
    default: null
  },
  watch: {
    type: String,
    default: 'false'
  },
  stroke: {
    type: String,
    default: null
  }
})

let box = null

const iconBox = ref(null)

class IconBox {
  constructor(config = {color: null, listen: 'false', stroke: null}) {
    this.iconBox = tool.refToDom(iconBox)
    this.iconBoxRect = tool.getDomRect(this.iconBox)

    this.cssListener = null

    this.listen = config.listen
    this.color = config.color
    this.stroke = config.stroke

    this.init()
  }

  init() {
    this.init_svg_position()
    if (this.color === null) {
      this.update_color()
      if (this.listen === 'true') this.add_event()
    } else this.set_fill_for_child()
    this.add_stroke()
  }

  init_svg_position = () => {
    const svg = this.iconBox.querySelector('svg')
    if (svg === null) return
    const svgRect = tool.getDomRect(svg)
    tool.setStyle(svg, {
      'position': 'absolute',
      'top': `${(this.iconBoxRect.height - svgRect.height) /2}px`,
      'left': `${(this.iconBoxRect.width - svgRect.width) /2}px`
    })
  }

  add_stroke = () => {
    if (this.stroke !== null) {
      this.iconBox.querySelectorAll('path').forEach(p => {
        const length = p.getTotalLength()
        tool.setStyle(p, {
          'stroke-dasharray': length,
          'stroke-dashoffset': length,
          'stroke': this.stroke,
          'stroke-width': 10,
        })
        setTimeout(() => {
          tool.cssDom(p, 'stroke-dashoffset', 0)
          tool.cssDom(p, 'transition', 'stroke-dashoffset 2s')
        }, 10)
      })
    }
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
  return new IconBox({color: props.color, listen: props.watch, stroke: props.stroke})
}

watch(() => props, () => {
  box = createBox()
}, {deep: true})

onMounted(() => {
  box = createBox()
})

onUnmounted(() => {
  if (props.watch === 'true') box.cssListener.clear_listener()
})
</script>

<template>
  <div class="iconBox" ref="iconBox">
    <slot>
      <weather-shower></weather-shower>
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