<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {tool} from "@/utils/index.js";
import {IconBox} from "@/components/box/index.js";
import {AddIcon, CloseIcon, RemoveIcon} from "@/components/icon/index.js";

let box = null

const dialogBox = ref(null)
const dialog = ref(null)
const ctrlBar = ref(null)

const isScale = ref(false)

const props = defineProps({
  theme: {
    type: String,
    default: 'light',
  },
  isDrag: {
    type: String,
    default: 'true'
  },
  modal: {
    type: String,
    default: 'true'
  },
  closeOnModal: {
    type: String,
    default: 'true'
  },
  overflow: {
    type: String,
    default: 'false'
  }
})

class DialogBox {
  constructor() {
    this.dialogBox = tool.refToDom(dialogBox)
    this.dialog = tool.refToDom(dialog)
    this.ctrlBar = tool.refToDom(ctrlBar)

    this.dialogRect = null

    this.scale = false
    this.drag = false
    this.poi = {left: 0, top: 0}
    this.delta = {left: 0, top: 0}
    this.scrollBar = 15

    this.init()
  }

  init = () => {
    this.init_dialog_size()
    this.set_dialog_position()
    this.add_event()
  }

  init_dialog_size = () => {
    this.dialogRect = tool.getRefRect(dialog)
    this.poi = {
      left: (window.innerWidth - this.dialogRect.width) / 2,
      top: (window.innerHeight - this.dialogRect.height) / 2,
    }
    tool.cssDom(this.dialogBox, 'display', 'none')
    tool.cssDom(this.dialogBox, 'scale', 0)
  }

  set_dialog_position = () => {
    tool.cssDom(this.dialog, 'top', `${this.poi.top}px`)
    tool.cssDom(this.dialog, 'left', `${this.poi.left}px`)
  }

  move_dialog = e => {
    if (!this.drag) return

    this.poi.left = e.clientX - this.delta.left
    this.poi.top = e.clientY - this.delta.top


    // 控制在视区内
    if (props.overflow === 'false'){
      const distanceRight = window.innerWidth - this.dialogRect.width - this.scrollBar
      const distanceBottom = window.innerHeight - this.dialogRect.height

      this.poi.left = this.poi.left > 0 ? this.poi.left : 0
      this.poi.top = this.poi.top > 0 ? this.poi.top : 0

      this.poi.left = this.poi.left < distanceRight ? this.poi.left : distanceRight
      this.poi.top = this.poi.top < distanceBottom ? this.poi.top : distanceBottom
    }

    this.set_dialog_position()
  }

  add_event = () => {
    this.ctrlBar.addEventListener('mousedown', e => {
      if (e.target.classList.contains('ctrlBar') && !this.scale) {
        this.drag = true
        this.delta.left = e.offsetX
        this.delta.top = e.offsetY
      }
    })
  }

  open_dialog = () => {
    tool.cssDom(this.dialogBox, 'display', 'block')
    setTimeout(() => {
      tool.cssDom(this.dialogBox, 'opacity', 1)
      tool.cssDom(this.dialogBox, 'scale', 1)
    }, 10)
  }

  close_dialog = () => {
    tool.cssDom(this.dialogBox, 'opacity', 0)
    tool.cssDom(this.dialogBox, 'scale', 0)
    setTimeout(() => {
      tool.cssDom(this.dialogBox, 'display', `none`)
    }, 500)
  }

  toggle_scale = () => {
    this.scale = !this.scale

    isScale.value = this.scale

    if (this.scale === true) {
      tool.cssDom(this.ctrlBar, 'cursor', 'default')
      this.dialog.classList.toggle('scaleDialog')
      setTimeout(() => {
        tool.cssDom(this.dialog, 'width', `${window.innerWidth}px`)
        tool.cssDom(this.dialog, 'height', `${window.innerHeight}px`)
        tool.cssDom(this.dialog, 'top', `0`)
        tool.cssDom(this.dialog, 'left', `0`)
      }, 10)
    } else {
      if(props.isDrag === 'true') tool.cssDom(this.ctrlBar, 'cursor', 'move')
      tool.cssDom(this.dialog, 'width', `${this.dialogRect.width}px`)
      tool.cssDom(this.dialog, 'height', `${this.dialogRect.height}px`)
      tool.cssDom(this.dialog, 'top', `${this.poi.top}px`)
      tool.cssDom(this.dialog, 'left', `${this.poi.left}px`)
      setTimeout(() => {
        this.dialog.classList.toggle('scaleDialog')
      }, 500)
    }

  }
}

const createBox = () => {
  return new DialogBox()
}

const handleMove = e => {
  box.move_dialog(e)
}

const handleUp = () => {
  box.drag = false
}

onMounted(() => {
  box = createBox()
  if (props.isDrag === 'true'){
    tool.cssDom(box.ctrlBar, 'cursor', 'move')
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
  }
  if (props.closeOnModal === 'true'){
    box.dialogBox.querySelector('.modal').addEventListener('click', ()=>{
      box.close_dialog()
    })
  }
})

onUnmounted(() => {
  if (props.isDrag === 'true') {
    window.removeEventListener('mousemove', handleMove)
    window.removeEventListener('mouseup', handleUp)
  }
})

const openDialog = () => {
  box.open_dialog()
}

const closeDialog = () => {
  box.close_dialog()
}

const toggleScaleDialog = () => {
  box.toggle_scale()
}

defineExpose({
  openDialog,
  closeDialog,
  toggleScaleDialog,
})


</script>

<template>
  <div class="dialogBox" ref="dialogBox">
    <div class="modal" v-if="modal === 'true'"></div>
    <div class="dialog" ref="dialog">
      <div class="ctrlBar" ref="ctrlBar">
        <slot name="ctrlBar">
          <div class="closeBtn" @click="closeDialog">
            <icon-box watch="true">
              <close-icon></close-icon>
            </icon-box>
          </div>
          <div class="scaleBtn" @click="toggleScaleDialog">
            <icon-box watch="true" v-if="!isScale">
              <add-icon></add-icon>
            </icon-box>
            <icon-box watch="true" v-else>
              <remove-icon></remove-icon>
            </icon-box>
          </div>

        </slot>
      </div>
      <div class="header">
        <slot name="header">

        </slot>
      </div>
      <div class="content">
        <slot name="content">

        </slot>
      </div>
      <div class="footer">
        <slot name="footer">

        </slot>
      </div>
    </div>
  </div>

</template>

<style scoped>
.dialogBox {
  position: fixed;
  z-index: var(--over-highest);
  left: 0;
  top: 0;
  display: block;
  opacity: 0;
  width: 100%;
  height: 100%;
  transition: all 0.5s;
}
.dialogBox .modal{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.35);
}
.dialogBox .dialog {
  position: absolute;
  top: 0;
  left: 30%;
  width: 200px;
  background-color: white;
  transition: width 0.5s, height 0.5s;
}

.dialogBox .scaleDialog {
  transition: all 0.5s;
}

.dialogBox .dialog .ctrlBar {
  height: 20px;
  background-color: #fff;
}

.dialogBox .dialog .ctrlBar .closeBtn {
  position: absolute;
  left: 7px;
  top: 3px;
  width: 13px;
  height: 13px;
  background-color: #ff5f58;
  border-radius: 50%;
  cursor: pointer;
  padding: 2px;
  color: #ff5f58;
}

.dialogBox .dialog .ctrlBar .closeBtn:hover {
  color: black;
}

.dialogBox .dialog .ctrlBar .scaleBtn {
  position: absolute;
  left: 25px;
  top: 3px;
  width: 13px;
  height: 13px;
  background-color: #ffbc2e;
  border-radius: 50%;
  cursor: pointer;
  padding: 2px;
  color: #ffbc2e;
}

.dialogBox .dialog .ctrlBar .scaleBtn:hover {
  color: black;
}
</style>