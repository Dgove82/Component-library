<script setup>
import {onMounted, onUnmounted, ref} from "vue"
import {tool} from '@/utils'

const props = defineProps({
  width: {
    type: String,
    default: "100%"
  },
  trigger: {
    type: String,
    default: "click",
  },
  active: {
    type: Boolean,
    default: false
  },
  direction: {
    type: String,
    default: "upon"
  },
  color: {
    type: String,
    default: "#fff"
  },
  showArrow: {
    type: String,
    default: "true"
  }
})

const trigger = ref(null)
const arrow = ref(null)
const popBox = ref(null)

let popover = null
const thisPop = ref({
  active: false
})


class Popover {
  constructor(config = {gap: 3, scrollBarWidth: 10, direction: 'upon', showArrow: 'true'}) {
    this.controller = tool.refToDom(trigger)
    this.arrow = tool.refToDom(arrow)
    this.popBox = tool.refToDom(popBox)

    this.gap = config.gap ? config.gap : 3
    this.scrollBar = config.scrollBarWidth ? config.scrollBarWidth : 10
    this.originDirection = config.direction ? config.direction : 'upon'
    this.showArrow = config.showArrow ? config.showArrow : 'true'
    this.originPopWidth = null

    this.distance = null
    this.controllerRect = null
    this.popBoxRect = null
    this.arrowRect = null

    this.init()
  }

  // 初始化
  init() {
    // 设置状态
    this.setState(thisPop.value.active)
    // 设置宽度
    tool.css(this.popBox, 'width', props.width)
    // 添加监听事件
    this.addEvent()
    // 添加
    this.adjust()
  }

  rectUpdate = () => {
    this.distance = {}
    this.controllerRect = tool.getDomRect(this.controller)
    this.popBoxRect = tool.getDomRect(this.popBox)
    this.arrowRect = tool.getDomRect(this.arrow)

    if (this.originPopWidth === null) this.originPopWidth = this.popBoxRect.width

    const viewWidth = window.innerWidth - this.scrollBar

    if (this.originPopWidth > viewWidth) {
      this.popBoxRect.width = viewWidth
      tool.css(this.popBox, 'width', `${viewWidth}px`)
    } else {
      tool.css(this.popBox, 'width', `${this.originPopWidth}px`)
      this.popBoxRect.width = this.originPopWidth
    }
  }

  fineTuning = () => {
    const distanceRight = (this.popBoxRect.width - this.controllerRect.width) / 2
    const right = window.innerWidth - this.controllerRect.right - this.scrollBar
    const distanceBottom = (this.popBoxRect.height - this.controllerRect.height) / 2
    const bottom = window.innerHeight - this.controllerRect.bottom

    if (['upon', 'down'].includes(this.distance.direction)) {
      if (this.distance.leftP > this.controllerRect.left && this.controllerRect.left > 0) {
        this.distance.leftP = this.controllerRect.left
      } else if (this.controllerRect.left <= 0) {
        this.distance.leftP = 0
      } else if (distanceRight > right && right > 0) {
        this.distance.leftP += distanceRight - right
      } else if (right <= 0) {
        this.distance.leftP += distanceRight
      }

    } else if (['left', 'right'].includes(this.distance.direction)) {
      if (this.distance.topP > this.controllerRect.top && this.controllerRect.top > 0) {
        this.distance.topP = this.controllerRect.top
      } else if (this.controllerRect.top <= 0) {
        this.distance.topP = 0
      } else if (distanceBottom > bottom && bottom > 0) {
        this.distance.topP += distanceBottom - bottom
      } else if (bottom <= 0) {
        this.distance.topP += distanceBottom
      }

    }
  }

  setArrowDown = () => {
    this.distance.topA = 0
    tool.css(this.arrow, 'top', `${-this.distance.topA}px`)

    this.distance.leftA = this.distance.leftP + (this.controllerRect.width - this.arrowRect.width) / 2
    tool.css(this.arrow, 'left', `${this.distance.leftA}px`)

    tool.css(this.arrow, 'border-bottom-color', 'transparent')
    tool.css(this.arrow, 'border-right-color', 'transparent')
  }

  setDown = () => {
    this.distance.topP = this.controllerRect.height + this.gap
    tool.css(this.popBox, 'top', `${this.distance.topP}px`)

    this.distance.leftP = (this.popBoxRect.width - this.controllerRect.width) / 2

    this.fineTuning()

    tool.css(this.popBox, 'left', `${-this.distance.leftP}px`)

    if (this.showArrow === 'true') this.setArrowDown()
  }

  setArrowUpon = () => {
    this.distance.topA = this.popBoxRect.height - this.arrowRect.height
    tool.css(this.arrow, 'top', `${this.distance.topA}px`)

    this.distance.leftA = this.distance.leftP + (this.controllerRect.width - this.arrowRect.width) / 2
    tool.css(this.arrow, 'left', `${this.distance.leftA}px`)

    tool.css(this.arrow, 'border-left-color', 'transparent')
    tool.css(this.arrow, 'border-top-color', 'transparent')
  }

  setUpon = () => {
    this.distance.topP = this.popBoxRect.height + this.gap
    tool.css(this.popBox, 'top', `${-this.distance.topP}px`)

    this.distance.leftP = (this.popBoxRect.width - this.controllerRect.width) / 2

    this.fineTuning()

    tool.css(this.popBox, 'left', `${-this.distance.leftP}px`)

    if (this.showArrow === 'true') this.setArrowUpon()
  }

  setArrowLeft = () => {
    this.distance.topA = this.distance.topP + (this.controllerRect.height - this.arrowRect.height) / 2
    tool.css(this.arrow, 'top', `${this.distance.topA}px`)

    this.distance.leftA = this.popBoxRect.width - this.arrowRect.width
    tool.css(this.arrow, 'left', `${this.distance.leftA}px`)

    tool.css(this.arrow, 'border-left-color', 'transparent')
    tool.css(this.arrow, 'border-bottom-color', 'transparent')
  }

  setLeft = () => {
    this.distance.leftP = this.popBoxRect.width + this.gap
    tool.css(this.popBox, 'left', `${-this.distance.leftP}px`)

    this.distance.topP = (this.popBoxRect.height - this.controllerRect.height) / 2

    this.fineTuning()

    tool.css(this.popBox, 'top', `${-this.distance.topP}px`)

    if (this.showArrow === 'true') this.setArrowLeft()
  }

  setArrowRight = () => {
    this.distance.leftA = 0
    tool.css(this.arrow, 'left', `${this.distance.leftA}px`)

    this.distance.topA = this.distance.topP + (this.controllerRect.height - this.arrowRect.height) / 2
    tool.css(this.arrow, 'top', `${this.distance.topA}px`)

    tool.css(this.arrow, 'border-right-color', 'transparent')
    tool.css(this.arrow, 'border-top-color', 'transparent')
  }

  setRight = () => {
    this.distance.leftP = this.controllerRect.width + this.gap
    tool.css(this.popBox, 'left', `${this.distance.leftP}px`)

    this.distance.topP = (this.popBoxRect.height - this.controllerRect.height) / 2

    this.fineTuning()

    tool.css(this.popBox, 'top', `${-this.distance.topP}px`)

    if (this.showArrow === 'true') this.setArrowRight()

  }

  chooseDirection = () => {
    const height = this.popBoxRect.height + this.gap
    const width = this.popBoxRect.width + this.gap

    switch (this.originDirection) {
      case 'upon':
        if (this.controllerRect.top < height) this.distance.direction = 'down'
        else this.distance.direction = 'upon'
        break
      case 'down':
        if (window.innerHeight - this.controllerRect.bottom < height) this.distance.direction = 'upon'
        else this.distance.direction = 'down'
        break
      case 'left':
        if (this.controllerRect.left < width) this.distance.direction = 'right'
        else this.distance.direction = 'left'
        break
      case 'right':
        if (window.innerWidth - this.controllerRect.right - this.scrollBar < width) this.distance.direction = 'left'
        else this.distance.direction = 'right'
        break
    }
  }

  adjust = () => {
    this.rectUpdate()
    this.chooseDirection()

    switch (this.distance.direction) {
      case 'upon':
        this.setUpon()
        break
      case 'down':
        this.setDown()
        break
      case 'left':
        this.setLeft()
        break
      case 'right':
        this.setRight()
        break
    }
  }

  setState = (state) => thisPop.value.active = state

  toggleState = () => thisPop.value.active = !thisPop.value.active

  addEvent = () => {
    let exist = {trigger: false, popBox: false}

    const triggerLeave = () => exist.trigger = false

    const triggerOver = () => exist.trigger = true

    const popBoxLeave = () => exist.popBox = false

    const popBoxOver = () => exist.popBox = true


    const clickActive = () => {
      const removeListener = () => {
        this.popBox.removeEventListener("mouseleave", popBoxLeave)
        this.popBox.removeEventListener("mouseover", popBoxOver)
        this.controller.removeEventListener("mouseleave", triggerLeave)
        this.controller.removeEventListener("mouseover", triggerOver)
      }

      const addListener = () => {
        this.popBox.addEventListener("mouseleave", popBoxLeave)
        this.popBox.addEventListener("mouseover", popBoxOver)
        this.controller.addEventListener("mouseleave", triggerLeave)
        this.controller.addEventListener("mouseover", triggerOver)
      }

      const close = () => {
        if (!(exist.popBox || exist.trigger)) {
          this.setState(false)
          removeListener()
          window.removeEventListener("click", close)
        }
      }

      this.toggleState()

      if (thisPop.value.active) {
        exist.trigger = true
        addListener()
        window.addEventListener('click', close)
      } else {
        removeListener()
        window.removeEventListener("click", close)
      }
    }

    const hoverActive = () => {
      const popBoxClose = () => {
        popBoxLeave()
        close()
      }

      const removeListener = () => {
        this.popBox.removeEventListener("mouseleave", popBoxClose)
        this.popBox.removeEventListener("mouseover", popBoxOver)
      }

      const addListener = () => {
        this.popBox.addEventListener("mouseover", popBoxOver)
        this.popBox.addEventListener("mouseleave", popBoxClose)
      }

      const close = () => {
        rateCtrl.debounce(() => {
          if (!(exist.popBox || exist.trigger)) {
            this.setState(false)
            removeListener()
          }
        }, 200)
      }

      this.setState(true)
      addListener()

      this.controller.addEventListener("mouseleave", () => {
        triggerLeave()
        close()
      })

    }

    switch (props.trigger) {
      case 'click':
        this.controller.addEventListener("click", clickActive)
        break
      case 'hover':
        this.controller.addEventListener("mouseover", hoverActive)
        break
      default:
        break
    }
  }
}


const rateCtrl = new tool.RateCtrl()

const resizeView = () => {
  rateCtrl.debounce(() => {
    popover.adjust()
  }, 200)
}

onMounted(() => {
  popover = new Popover({direction: props.direction, showArrow: props.showArrow})

  window.addEventListener('resize', resizeView)
  window.addEventListener('scroll', resizeView)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeView)
  window.removeEventListener('scroll', resizeView)
})


</script>

<template>
  <div class="popover">
    <div class="triggerBox">
      <div class="trigger" ref="trigger">
        <slot name="trigger">
          <button>控制器</button>
        </slot>
      </div>
    </div>
    <div :class="{popBox:true, hide: !thisPop.active}"
         ref="popBox"
    >
      <div class="pop"
           :style="{backgroundColor: color}"
      >
        <slot name="content">
          内容
        </slot>
      </div>
      <span :class="{arrow: true, noArrow: showArrow === 'false'}"
            ref="arrow"
            :style="{backgroundColor: color}"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.popover {
  position: relative;
}

.triggerBox {
  position: relative;
  width: fit-content;
}

.triggerBox .trigger {
  display: inline-block;
}

.popBox {
  background-color: transparent;
  height: fit-content;
  width: fit-content;
  position: absolute;
  z-index: var(--over-highest);
  left: 0;
  top: 0;
  border: 2px solid transparent;
  padding: 5px;
  opacity: 1;
}

.hide {
  opacity: 0;
}

.popBox .pop {
  height: fit-content;
  width: 100%;
  overflow: hidden;
  background-color: white;
  position: relative;
  border-radius: 4px;
  border: 1px solid var(--border-color-first-level);
  top: 0;
  left: 0;
  padding: 8px;
}

.popBox .arrow {
  background-color: #fff;
  display: inline-block;
  box-sizing: border-box;
  border: 1px solid var(--border-color-first-level);
  border-top-left-radius: 2px;
  height: 10px;
  width: 10px;
  transform: rotate(45deg);
  position: absolute;
  top: 0;
  left: 0;
}

.popBox .noArrow {
  display: none;
}


</style>