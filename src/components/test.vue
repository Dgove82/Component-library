<script setup>
import {WeatherSnow} from "@/components/icon/index.js";
import {IconBox, PopOverBox, VariableBox} from "@/components/box/index.js";
import {NormalButton} from "@/components/button/index.js";


const props = defineProps({
  t_id: {
    type: Number,
    required: true,
  }
})



</script>

<template>
  <div v-if="t_id === 0">
    <div style="height: 1000px;"></div>
    <div class="title">
      可变盒
    </div>
    <div class="mBox">
      <VariableBox></VariableBox>
    </div>
  </div>
  <div v-if="t_id === 1">
    <div class="title">
      图标
    </div>
    <div class="sBox">
      <IconBox>
        <WeatherSnow></WeatherSnow>
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
      <div style="height: 500px;"></div>
      <div class="box"
           style="width: 90px; margin: 50px auto; position: relative; right: -500px;">
        <pop-over-box width="2000px" trigger="hover" direction="upon" color="white" >
          <template #trigger>
            <button>上</button>
          </template>
          <template #content>
            内容
          </template>
        </pop-over-box>
      </div>
      <div class="box"
           style="width: 90px; margin: 50px auto; position: relative; left: -500px;">
        <pop-over-box width="100px" trigger="click" direction="left" color="white">
          <template #trigger>
            <button>左</button>
          </template>
          <template #content>
            内容
          </template>
        </pop-over-box>
      </div>
      <div class="box"
           style="width: 90px; margin: 50px auto; position: relative; right: -500px">
        <pop-over-box width="100px" trigger="click" direction="right" color="white">
          <template #trigger>
            <button>右</button>
          </template>
          <template #content>
            内容
          </template>
        </pop-over-box>
      </div>
      <div class="box"
           style="width: 90px; margin: 50px auto; position: relative;  right: -500px;">
        <pop-over-box width="100px" trigger="click" direction="down" color="white">
          <template #trigger>
            <button>下</button>
          </template>
          <template #content>
            内容
          </template>
        </pop-over-box>
      </div>
      <div style="height: 1000px;"></div>
    </div>
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