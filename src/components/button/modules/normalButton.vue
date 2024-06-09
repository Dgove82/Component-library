<script setup>

</script>

<template>
<div class="btnBox">
  <slot>
    按钮
  </slot>
</div>
</template>

<style scoped>
.btnBox{
  cursor: pointer;
  background-color: var(--button-color-normal);
  color: var(--font-color-high);
  padding: 12px 20px;
  font-size: 14px;
  text-align: center;
  display: inline-block;
}
.btnBox:hover{
  opacity: 0.7;
}
</style>