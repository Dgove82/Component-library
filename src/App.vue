<script setup>
console.log(process.env)
</script>

<template>
<router-view></router-view>
</template>

<style>
:root{
  --color-soft-grey: #f2f4f4;
  --color-soft-blue: #D6EAF8;
  --color-soft-green: #D5F5E3;
  --color-soft-black: #EAECEE;
  --color-soft-pink: #EBDEF0;
  --color-soft-red: #FADBD8;
  --color-dark-black: #17202A;
  --color-dark-grey: #BDC3C7;
  --color-dark-blue: #3498DB;
  --color-dark-green: #2ECC71;
  --color-dark-pink: #8E44AD;
  --color-dark-red: #E74C3C ;
  --button-color-normal: #409EFF;
  --button-color-success: #67C23A;
  --button-color-warning: #E6A23C;
  --button-color-danger: #F56C6C;
  --button-color-info: #909399;
  --border-color-first-level: #DCDFE6;
  --border-color-second-level: #E4E7ED;
  --border-color-third-level: #EBEEF5;
  --font-color-main: #303133;
  --font-color-normal: #606266;
  --font-color-second: #909399;
  --font-color-hide: #C0C4CC;
  --font-color-high: #FFFFFF;
  --over-footer: 10;
  --over-middum: 100;
  --over-cover: 1000;
  --over-highest: 10000;
  --background-color: var(--color-soft-grey);
  --scrollbar-track-color: white;
  --scrollbar-thumb-color: linear-gradient(var(--color-dark-grey), var(--color-dark-blue));
}
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: var(--scrollbar-track-color);
}

::-webkit-scrollbar-thumb {
  border: 2px solid var(--scrollbar-track-color);
  background: var(--scrollbar-thumb-color);
}
::-webkit-scrollbar-thumb:hover{
  box-shadow: inset 0 0 6px rgba(255, 255, 255);
}
body{
  background-color: var(--background-color);
}
</style>
