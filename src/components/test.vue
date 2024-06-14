<script setup>
import {ImageIcon} from "@/components/icon/index.js";
import {DialogBox, IconBox, ImageBox, LoadBox, PopOverBox, RadiusBox} from "@/components/box/index.js";
import {NormalButton} from "@/components/button/index.js";
import {ImageLoader} from "@/components/loader/index.js";
import {onMounted, ref} from "vue";



const popover = ref(null)

const props = defineProps({
  t_id: {
    type: Number,
    required: true,
  }
})

const radBox = ref(null)
const dialog = ref(null)

onMounted(() => {

})


</script>

<template>
  <div v-if="t_id === 0">
    <div class="title">
      可变盒
    </div>
    <div class="mBox" style="margin-bottom: 50px;">
      <radius-box ref="radBox"></radius-box>
    </div>
    {{radBox?.radiusStyle}}
    <div>
    </div>
  </div>
  <div v-if="t_id === 1">
    <div class="title">
      图标
    </div>
    <div class="sBox">
      <IconBox watch="true" stroke="yellow">
        <image-icon></image-icon>
      </IconBox>
    </div>
  </div>
  <div v-if="t_id === 2">
    <div class="title">
      按钮
    </div>
    <div class="sBox">
      <NormalButton></NormalButton>
    </div>
  </div>
  <div v-if="t_id === 3">
    <div class="title">
      提示框
    </div>
    <div class="sBox">
      <div class="box"
           style="width: 90px; margin: 50px auto; position: relative;">
        <pop-over-box width="600px" trigger="click" direction="upon" theme="light" ref="popover">
          <template #trigger>
            <button style="width: 100px;">上</button>
          </template>
          <template #content>
            内容
          </template>
        </pop-over-box>
      </div>
      <div class="box"
           style="width: 90px; margin: 50px auto; position: relative; left: -100px">
        <pop-over-box width="100px" trigger="click" direction="left" back-color="red">
          <template #trigger>
            <button style="width: 100px;">左</button>
          </template>
          <template #content>
            内容
          </template>
        </pop-over-box>
      </div>
      <div class="box"
           style="width: 90px; margin: 50px auto; position: relative; right: -100px; top: -75px">
        <pop-over-box width="100px" trigger="click" direction="right">
          <template #trigger>
            <button style="width: 100px;">右</button>
          </template>
          <template #content>
            内容
          </template>
        </pop-over-box>
      </div>
      <div class="box"
           style="width: 90px; margin: 50px auto; position: relative; top: -75px">
        <pop-over-box width="100px" trigger="click" direction="down">
          <template #trigger>
            <button style="width: 100px;">下</button>
          </template>
          <template #content>
            内容
          </template>
        </pop-over-box>
      </div>
    </div>
  </div>
  <div v-if="t_id === 4">
    <div class="title">图片展示</div>
    <div class="sBox">
      <image-box></image-box>
    </div>
  </div>
  <div v-if="t_id === 5">
    <div class="title">加载盒展示</div>
    <div class="sBox">
      <load-box ref="load" watch="true">
        <image-loader></image-loader>
      </load-box>
    </div>
  </div>
  <div v-if="t_id === 6">
    <div class="sBox">
      <button @click="dialog.openDialog">打开</button>
    </div>
    <DialogBox ref="dialog"></DialogBox>
    <div style="height: 10000px"></div>
  </div>
</template>

<style scoped>
.title {
  background-color: var(--color-soft-pink);
  font-size: 20px;
  text-align: center;
}

.sBox {
  position: relative;
  width: 300px;
  height: 300px;
  margin: auto;
  border: 1px solid var(--border-color-first-level);
}

.mBox {
  height: 500px;
  width: 500px;
  margin: auto;
  border: 1px solid var(--border-color-first-level);
  position: relative;
}

.bBox {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>