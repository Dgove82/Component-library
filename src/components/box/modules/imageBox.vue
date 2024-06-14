<script setup>
import {onMounted, ref, watch} from "vue"
import {tool} from '@/utils'
import {IconBox, LoadBox} from "@/components/box/index.js";
import ImageLoader from "@/components/loader/modules/imageLoader.vue";
import {ImageIcon} from "@/components/icon/index.js";

const props = defineProps({
  image: {
    type: String,
    default: 'a'
  }
})

let imageBox = null

const image = ref(null)
const empty = ref(null)
const load = ref(null)

class ImageBox {
  constructor(imageSrc) {
    this.src = imageSrc

    this.image = tool.refToDom(image)
    this.empty = tool.refToDom(empty)
    this.load = tool.refToDom(load)

    this.init()
  }

  init() {
    this.check_src()
    this.add_event()
  }

  init_style(state) {
    setTimeout(() => {
      switch (state) {
        case 'no':
          tool.cssDom(this.image, 'opacity', 0)
          tool.cssDom(this.empty, 'opacity', 1)
          tool.cssDom(this.load, 'opacity', 0)
          break
        case 'load':
          tool.cssDom(this.image, 'opacity', 0)
          tool.cssDom(this.empty, 'opacity', 0)
          tool.cssDom(this.load, 'opacity', 1)
          break
        case 'ok':
          tool.cssDom(this.image, 'opacity', 1)
          tool.cssDom(this.empty, 'opacity', 0)
          tool.cssDom(this.load, 'opacity', 0)
          break
      }
    }, 10)
  }

  check_src() {
    if (this.src === null) this.load_error()
    else this.loading()
  }

  loading() {
    this.init_style('load')
    this.image.src = this.src
  }

  load_error = () => {
    tool.cssDom(this.empty, 'display', 'block')
    this.init_style('no')
    setTimeout(() => {
      tool.cssDom(this.load, 'display', 'none')
    }, 3000)
  }

  load_success = () => {
    tool.cssDom(this.image, 'display', 'block')
    this.init_style('ok')
    setTimeout(() => {
      tool.cssDom(this.load, 'display', 'none')
    }, 3000)

  }

  add_event() {
    this.image.addEventListener('load', this.load_success)
    this.image.addEventListener('error', this.load_error)
  }
}

const createImageBox = () => {
  return new ImageBox(props.image)
}

watch(() => props, () => {
  imageBox = createImageBox()
}, {deep: true})

onMounted(() => {
  imageBox = createImageBox()
})

</script>

<template>
  <div class="showBox">
    <img ref="image" src="" alt="无法加载"/>
    <div ref="empty" class="null">
      <slot name="empty">
        <div class="emptyBox">
          <icon-box>
            <image-icon></image-icon>
          </icon-box>
          <div class="tip">
            加载失败
          </div>
        </div>
      </slot>
    </div>
    <div ref="load" class="load">
      <slot name="load">
        <load-box>
          <image-loader></image-loader>
        </load-box>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.showBox {
  width: 100%;
  height: 100%;
}

.showBox img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  display: none;
  transition: opacity 3s;
}

.showBox .null {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  display: none;
  transition: opacity 6s;
}

.showBox .null .emptyBox {
  width: 30%;
  height: 30%;
  position: relative;
  top: calc((100% - 30%) / 2);
  left: calc((100% - 30%) / 2);
}

.showBox .null .emptyBox .tip {
  text-align: center;
}

.showBox .load {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 1;
  transition: opacity 3s;
}
</style>