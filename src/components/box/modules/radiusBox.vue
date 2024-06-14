<script setup>
import {onMounted, onUnmounted, ref} from "vue"
import {tool} from "@/utils/index.js";

const props = defineProps({
  watch: {
    type: String,
    default: 'true'
  }
})

let box = null

const radiusStyle = ref('')

const radiusBox = ref(null)
const model = ref(null)
const left = ref(null)
const top = ref(null)
const right = ref(null)
const bottom = ref(null)

class RadiusBox {
  constructor(config = {listen: 'false'}) {
    this.listen = config.listen

    this.radiusBox = tool.refToDom(radiusBox)
    this.model = tool.refToDom(model)
    this.drag = {
      left: tool.refToDom(left),
      top: tool.refToDom(top),
      right: tool.refToDom(right),
      bottom: tool.refToDom(bottom)
    }

    this.draging = {
      left: false,
      top: false,
      right: false,
      bottom: false,
    }
    this.args = {top: 50, right: 50, bottom: 50, left: 50}
    this.modelStyle = {}

    this.boxRect = null
    this.dragRect = null
    this.cssListener = null

    this.init()

  }

  init = () => {
    this.update()
    this.add_event()
  }

  update = () => {
    const rect = tool.getDomRect(this.radiusBox)
    this.boxRect = {
      top: rect.top + scrollY,
      left: rect.left + scrollX,
      height: rect.height,
      width: rect.width,
    }
    this.modelStyle['height'] = `${rect.height}px`
    this.modelStyle['width'] = `${rect.width}px`

    this.update_drag_rect()

    this.update_drag_by_args()

  }

  update_drag_rect = () => {
    const width = this.boxRect.width / 100
    const height = this.boxRect.height / 100
    const rect = width > height ? height : width
    this.dragRect = rect > 10 ? rect : 10
    this.radiusBox.querySelectorAll('.drag').forEach((el) => {
      tool.cssDom(el, 'width', `${this.boxRect}px`)
      tool.cssDom(el, 'height', `${this.boxRect}px`)
    })
  }

  update_drag_by_args = () => {
    tool.cssDom(this.drag.left, 'top', `${(this.boxRect.height * Number(this.args.left) / 100) - this.dragRect / 2}px`)
    tool.cssDom(this.drag.left, 'left', `${-this.dragRect / 2}px`)

    tool.cssDom(this.drag.top, 'top', `${-this.dragRect / 2}px`)
    tool.cssDom(this.drag.top, 'left', `${(this.boxRect.width * Number(this.args.top) / 100) - this.dragRect / 2}px`)

    tool.cssDom(this.drag.right, 'top', `${(this.boxRect.height * Number(this.args.right) / 100) - this.dragRect / 2}px`)
    tool.cssDom(this.drag.right, 'left', `${this.boxRect.width - this.dragRect / 2}px`)

    tool.cssDom(this.drag.bottom, 'top', `${this.boxRect.height - this.dragRect / 2}px`)
    tool.cssDom(this.drag.bottom, 'left', `${(this.boxRect.width * Number(this.args.bottom) / 100) - this.dragRect / 2}px`)

    this.update_model()

  }

  update_model = () => {
    this.modelStyle['border-radius'] = `${this.args.top}% ${100 - this.args.top}% ${100 - this.args.bottom}% ${this.args.bottom}% / ${this.args.left}% ${this.args.right}% ${100 - this.args.right}% ${100 - this.args.left}%`
    tool.cssDom(this.model, 'border-radius',
        this.modelStyle['border-radius'],
    )
    radiusStyle.value = JSON.stringify(this.modelStyle)
  }

  handle_mouse_up = () => {
    for (let poi in this.draging) {
      this.draging[poi] = false
    }
  }

  handle_mouse_move = (e) => {
    for (let poi in this.draging) {
      if (this.draging[poi] === true) {
        const deltaY = e.pageY - this.boxRect.top
        const deltaX = e.pageX - this.boxRect.left
        if (deltaY >= 0 && deltaY <= this.boxRect.height && (poi === 'left' || poi === 'right')) {
          tool.cssDom(this.drag[poi], 'top', `${deltaY - (this.dragRect / 2)}px`)
          this.args[poi] = (deltaY * 100 / this.boxRect.height).toFixed()
        } else if (deltaX >= 0 && deltaX <= this.boxRect.width && (poi === 'top' || poi === 'bottom')) {
          tool.cssDom(this.drag[poi], 'left', `${deltaX - (this.dragRect / 2)}px`)
          this.args[poi] = (deltaX * 100 / this.boxRect.width).toFixed()
        }
        this.update_model()
        break
      }
    }
  }

  add_event = () => {
    for (let p in this.drag) {
      this.drag[p].addEventListener('mousedown', () => {
        this.draging[p] = true
      })
    }

    if (this.listen === 'true'){
      this.cssListener = new tool.CssListener({
        dom: this.radiusBox,
        prop: ['width', 'height'],
        func: this.update,
        space: 200
      })

      this.cssListener.start_listener()
    }
  }

  change_box_width = (width) => {
    if (this.listen !== 'true'){
      tool.cssDom(this.radiusBox, 'width', `${width}px`)
      this.update()
    }
  }

  change_box_height = (height) => {
    if (this.listen !== 'true'){
      tool.cssDom(this.radiusBox, 'height', `${height}px`)
      this.update()
    }
  }

}

const createBox = () => {
  return new RadiusBox({listen: props.watch})
}

const mouseMove = (e) => {
  box.handle_mouse_move(e)
}

const mouseUp = (e) => {
  box.handle_mouse_up(e)
}


onMounted(() => {
  box = createBox()

  window.addEventListener('mousemove', mouseMove)
  window.addEventListener('mouseup', mouseUp)
})

onUnmounted(() => {
  if(props.watch === 'true') box.cssListener.clear_listener()
  window.removeEventListener('mousemove', mouseMove)
  window.removeEventListener('mouseup', mouseUp)
})

const changeBoxWidth = (width) => {
  box.change_box_width(width)
}

const changeBoxHeight = (height) => {
  box.change_box_height(height)
}


defineExpose({
  radiusStyle,
  changeBoxHeight,
  changeBoxWidth
})

</script>

<template>
  <div class="radiusBox" ref="radiusBox">
    <div class="radiusModel" ref="model"></div>
    <ul class="ctrl">
      <li class="drag" ref="left"></li>
      <li class="drag" ref="top"></li>
      <li class="drag" ref="right"></li>
      <li class="drag" ref="bottom"></li>
    </ul>
  </div>
</template>

<style scoped>
.radiusBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 1px dashed black;
}

.radiusBox .radiusModel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(lightblue, lightgreen);
}

.radiusBox .ctrl {
  list-style: none;
}

.radiusBox .ctrl .drag {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
  background-color: #fff;
  cursor: pointer;
  border: 1px solid black;
}


</style>