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
  width: 100%;
  height: fit-content;
  border: 1px solid transparent;
  box-sizing: border-box;
}
.btnBox:hover{
  opacity: 0.7;
}
.btnBox:active{
  border-color:  blue;
}
</style>