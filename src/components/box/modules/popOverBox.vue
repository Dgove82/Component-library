<script setup>
import {onMounted, onUnmounted, ref, watch} from "vue"
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
  theme: {
    type: String,
    default: 'light'
  },
  backColor: {
    type: String,
    default: null
  },
  borderColor: {
    type: String,
    default: null
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

    this.appearRateCtrl = new tool.RateCtrl()
    this.disappearRateCtrl = new tool.RateCtrl()

    this.init()
  }

  // 初始化
  init() {
    // 设置状态
    this.setState(thisPop.value.active)
    // 设置样式
    this.initStyle()
    // 添加监听事件
    this.addEvent()
    // 添加
    this.adjust()

    // 偏移
    this.disappearState()
  }

  initStyle = () => {
    tool.cssDom(this.popBox, 'width', props.width)
    if (props.backColor !== null) {
      tool.cssDom(this.popBox, '--background-color', props.backColor)
      tool.cssDom(this.popBox, '--font-color', 'var(--dark-color)')
    } else if (props.theme === 'light') {
      tool.cssDom(this.popBox, '--background-color', 'var(--light-color)')
      tool.cssDom(this.popBox, '--font-color', 'var(--dark-color)')
    } else if (props.theme === 'dark') {
      console.log('?')
      tool.cssDom(this.popBox, '--background-color', 'var(--dark-color)')
      tool.cssDom(this.popBox, '--font-color', 'var(--light-color)')
    }
    if (props.borderColor !== null) tool.cssDom(this.popBox, '--border-color', props.borderColor)
    else if (props.theme === 'light') tool.cssDom(this.popBox, '--border-color', 'var(--dark-color)')
    else if (props.theme === 'dark') tool.cssDom(this.popBox, '--border-color', 'var(--light-color)')

  }

  rectUpdate = () => {
    this.distance = {}
    this.controllerRect = tool.getDomRect(this.controller)
    this.popBoxRect = tool.getDomRect(this.popBox)
    this.arrowRect = tool.getDomRect(this.arrow)

    if (this.originPopWidth === null) {
      this.originPopWidth = this.popBoxRect.width
      // 隐藏
      tool.cssDom(this.popBox, 'display', 'block')
    }

    const viewWidth = window.innerWidth - this.scrollBar

    if (this.originPopWidth > viewWidth) {
      this.popBoxRect.width = viewWidth
      tool.cssDom(this.popBox, 'width', `${viewWidth}px`)
    } else {
      tool.cssDom(this.popBox, 'width', `${this.originPopWidth}px`)
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
    tool.cssDom(this.arrow, 'top', `${-this.distance.topA}px`)

    this.distance.leftA = this.distance.leftP + (this.controllerRect.width - this.arrowRect.width) / 2
    tool.cssDom(this.arrow, 'left', `${this.distance.leftA}px`)

    tool.cssDom(this.arrow, 'border-top-color', 'var(--border-color)')
    tool.cssDom(this.arrow, 'border-left-color', 'var(--border-color)')
    tool.cssDom(this.arrow, 'border-bottom-color', 'transparent')
    tool.cssDom(this.arrow, 'border-right-color', 'transparent')
  }

  setDown = () => {
    this.distance.topP = this.controllerRect.height + this.gap
    tool.cssDom(this.popBox, 'top', `${this.distance.topP}px`)

    this.distance.leftP = (this.popBoxRect.width - this.controllerRect.width) / 2

    this.fineTuning()

    tool.cssDom(this.popBox, 'left', `${-this.distance.leftP}px`)

    if (this.showArrow === 'true') this.setArrowDown()
  }

  setArrowUpon = () => {
    this.distance.topA = this.popBoxRect.height - this.arrowRect.height
    tool.cssDom(this.arrow, 'top', `${this.distance.topA}px`)

    this.distance.leftA = this.distance.leftP + (this.controllerRect.width - this.arrowRect.width) / 2
    tool.cssDom(this.arrow, 'left', `${this.distance.leftA}px`)

    tool.cssDom(this.arrow, 'border-right-color', 'var(--border-color)')
    tool.cssDom(this.arrow, 'border-bottom-color', 'var(--border-color)')
    tool.cssDom(this.arrow, 'border-left-color', 'transparent')
    tool.cssDom(this.arrow, 'border-top-color', 'transparent')
  }

  setUpon = () => {
    this.distance.topP = this.popBoxRect.height + this.gap
    tool.cssDom(this.popBox, 'top', `${-this.distance.topP}px`)

    this.distance.leftP = (this.popBoxRect.width - this.controllerRect.width) / 2

    this.fineTuning()

    tool.cssDom(this.popBox, 'left', `${-this.distance.leftP}px`)

    if (this.showArrow === 'true') this.setArrowUpon()
  }

  setArrowLeft = () => {
    this.distance.topA = this.distance.topP + (this.controllerRect.height - this.arrowRect.height) / 2
    tool.cssDom(this.arrow, 'top', `${this.distance.topA}px`)

    this.distance.leftA = this.popBoxRect.width - this.arrowRect.width
    tool.cssDom(this.arrow, 'left', `${this.distance.leftA}px`)

    tool.cssDom(this.arrow, 'border-right-color', 'var(--border-color)')
    tool.cssDom(this.arrow, 'border-top-color', 'var(--border-color)')
    tool.cssDom(this.arrow, 'border-left-color', 'transparent')
    tool.cssDom(this.arrow, 'border-bottom-color', 'transparent')
  }

  setLeft = () => {
    this.distance.leftP = this.popBoxRect.width + this.gap
    tool.cssDom(this.popBox, 'left', `${-this.distance.leftP}px`)

    this.distance.topP = (this.popBoxRect.height - this.controllerRect.height) / 2

    this.fineTuning()

    tool.cssDom(this.popBox, 'top', `${-this.distance.topP}px`)

    if (this.showArrow === 'true') this.setArrowLeft()
  }

  setArrowRight = () => {
    this.distance.leftA = 0
    tool.cssDom(this.arrow, 'left', `${this.distance.leftA}px`)

    this.distance.topA = this.distance.topP + (this.controllerRect.height - this.arrowRect.height) / 2
    tool.cssDom(this.arrow, 'top', `${this.distance.topA}px`)

    tool.cssDom(this.arrow, 'border-left-color', 'var(--border-color)')
    tool.cssDom(this.arrow, 'border-bottom-color', 'var(--border-color)')
    tool.cssDom(this.arrow, 'border-right-color', 'transparent')
    tool.cssDom(this.arrow, 'border-top-color', 'transparent')
  }

  setRight = () => {
    this.distance.leftP = this.controllerRect.width + this.gap
    tool.cssDom(this.popBox, 'left', `${this.distance.leftP}px`)

    this.distance.topP = (this.popBoxRect.height - this.controllerRect.height) / 2

    this.fineTuning()

    tool.cssDom(this.popBox, 'top', `${-this.distance.topP}px`)

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
        if ((window.innerHeight - this.controllerRect.bottom < height)
            && (height < window.innerHeight - this.controllerRect.top)) this.distance.direction = 'upon'
        else this.distance.direction = 'down'
        break
      case 'left':
        if (this.controllerRect.left < width
            && width < window.innerWidth - this.controllerRect.right - this.scrollBar) this.distance.direction = 'right'
        else if (this.controllerRect.left >= width) this.distance.direction = 'left'
        else this.distance.direction = 'down'
        break
      case 'right':
        if (width > window.innerWidth - this.controllerRect.right - this.scrollBar
            && width < this.controllerRect.left) this.distance.direction = 'left'
        else if (width <= window.innerWidth - this.controllerRect.right - this.scrollBar) this.distance.direction = 'right'
        else this.distance.direction = 'down'
        break
    }
  }

  adjust = () => {
    tool.cssDom(this.popBox, 'display', 'block')

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

    if (!thisPop.value.active) tool.cssDom(this.popBox, 'display', 'none')
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
          this.removeAnimation()
          this.setState(false)
          removeListener()
          window.removeEventListener("click", close)
        }
      }

      this.toggleState()

      if (thisPop.value.active) {
        this.addAnimation()
        exist.trigger = true
        addListener()
        window.addEventListener('click', close)
      } else {
        this.removeAnimation()
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

  appearState = () => {
    tool.cssDom(this.popBox, 'opacity', 1)
    switch (this.distance.direction) {
      case 'upon':
        tool.cssDom(this.popBox, 'transform', 'translateY(0)')
        break
      case 'down':
        tool.cssDom(this.popBox, 'transform', 'translateY(0)')
        break
      case 'right':
        tool.cssDom(this.popBox, 'transform', 'translateX(0)')
        break
      case 'left':
        tool.cssDom(this.popBox, 'transform', 'translateX(0)')
        break
    }
  }

  addAnimation = () => {
    tool.cssDom(this.popBox, 'display', 'block')
    this.appearRateCtrl.debounce(() => {
      this.appearState()
    }, 10)
  }

  disappearState = () => {
    tool.cssDom(this.popBox, 'opacity', 0)
    switch (this.distance.direction) {
      case 'upon':
        tool.cssDom(this.popBox, 'transform', 'translateY(-100px)')
        break
      case 'down':
        tool.cssDom(this.popBox, 'transform', 'translateY(100px)')
        break
      case 'right':
        tool.cssDom(this.popBox, 'transform', 'translateX(100px)')
        break
      case 'left':
        tool.cssDom(this.popBox, 'transform', 'translateX(-100px)')
        break
    }
  }

  removeAnimation = () => {
    this.disappearState()
    this.disappearRateCtrl.debounce(() => {
      if (!thisPop.value.active) tool.cssDom(this.popBox, 'display', 'none')
    }, 200)
  }
}

const createPopOver = () => {
  return new Popover({direction: props.direction, showArrow: props.showArrow})
}

watch(() => props, () => {
  popover = createPopOver()
}, {
  deep: true,
})

const rateCtrl = new tool.RateCtrl()

const resizeView = () => {
  rateCtrl.debounce(() => {
    popover.adjust()
  }, 200)
}

onMounted(() => {
  popover = createPopOver()

  window.addEventListener('resize', resizeView)
  window.addEventListener('scroll', resizeView)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeView)
  window.removeEventListener('scroll', resizeView)
})

defineExpose({
  getState: () => {
    return thisPop.value.active
  },
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
    <div :class="{popBox:true}"
         ref="popBox"
    >
      <div class="pop"
           ref="pop"
      >
        <slot name="content">
          内容
        </slot>
      </div>
      <span :class="{arrow: true, noArrow: showArrow === 'false'}"
            ref="arrow"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.popover {
  position: relative;
  width: fit-content;
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
  left: 0;
  top: 0;
  border: 2px solid transparent;
  padding: 5px;
  display: block;
  animation: none;
  transition: all 0.2s;
  --dark-color: #303133;
  --light-color: white;
  --border-color: var(--dark-color);
  --font-color: var(--dark-color);
  --background-color: var(--light-color);
}

.popBox .pop {
  height: fit-content;
  width: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 4px;
  top: 0;
  left: 0;
  padding: 8px;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  color: var(--font-color);
}

.popBox .arrow {
  display: inline-block;
  box-sizing: border-box;
  border-top-left-radius: 2px;
  height: 10px;
  width: 10px;
  transform: rotate(45deg);
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  color: var(--font-color);
}

.popBox .noArrow {
  display: none;
}
</style>