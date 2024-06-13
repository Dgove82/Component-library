<script setup>
import {onMounted, ref, watch} from "vue"
import {tool} from '@/utils'
import {IconBox, LoadBox} from "@/components/box/index.js";
import {Image} from "@/components/icon/index.js";
import RotatingPoint from "@/components/loader/modules/rotatingPoint.vue";

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
  constructor(config = {image: null}) {
    this.src = config.image

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
    tool.cssDom(this.load, 'transition', 'opacity 3s')
    tool.cssDom(this.empty, 'transition', 'opacity 3s')
    this.init_style('no')
    setTimeout(() => {
      tool.cssDom(this.load, 'transition', 'none')
      tool.cssDom(this.empty, 'transition', 'none')
    }, 3000)
  }

  load_success = () => {
    tool.cssDom(this.load, 'transition', 'opacity 3s')
    tool.cssDom(this.image, 'transition', 'opacity 3s')
    this.init_style('ok')
    setTimeout(() => {
      tool.cssDom(this.load, 'transition', 'none')
      tool.cssDom(this.image, 'transition', 'none')
    }, 3000)

  }

  add_event() {
    this.image.addEventListener('load', this.load_success)
    this.image.addEventListener('error', this.load_error)
  }
}

const createImageBox = () => {
  return new ImageBox({image: props.image})
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
            <Image></Image>
          </icon-box>
        </div>
      </slot>
    </div>
    <div ref="load" class="load">
      <slot name="load">
        <load-box>
          <rotating-point></rotating-point>
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
}

.showBox .null {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

.showBox .null .emptyBox {
  width: 30%;
  height: 30%;
  position: relative;
  top: calc((100% - 30%) / 2);
  left: calc((100% - 30%) / 2);
  color: red;
}

.showBox .load {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}
</style>