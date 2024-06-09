<script setup>
import {WeatherShower} from "@/components/icon/index.js";
</script>

<template>
  <div class="iconBox">
    <slot>
      <WeatherShower></WeatherShower>
    </slot>
  </div>
</template>

<style>
.iconBox{
  width: 100%;
  height: 100%;
  position: relative;
}
.iconBox svg{
  width: 100%;
  height: 100%;
}
</style>