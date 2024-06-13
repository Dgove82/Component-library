<script setup>
import {computed, ref} from "vue";
import Test from "@/components/test.vue";

const t_id = ref('5');

const tid = computed(()=> {
  try{
    return parseInt(t_id.value);
  }
  catch(err){
    console.log(err)
  }
})


</script>

<template>
  <div class="showTitle">
    展示
  </div>
  <div class="showCtrl">
    <div class="cmdBox">
      <input class='cmd' v-model="t_id" />
    </div>
  </div>
  <div class="showBox">
    <test :t_id="tid"></test>
  </div>
</template>

<style scoped>
.showTitle{
  width: 100%;
  border-radius: 10px;
  height: 100px;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 10px;
  line-height: 100px;
  text-align: center;
  background-color: var(--color-soft-blue);
}
.showCtrl{
  height: 100px;
  border-radius: 10px;
  width: 100%;
  background-color: var(--color-soft-red);
}
.showCtrl .cmdBox{
  width: 50%;
  margin: 0 auto;
  height: 100%;
}
.showCtrl .cmdBox .cmd{
  padding-left: 10px;
  margin-top: 20px;
  width: 100%;
  height: 50%;
  font-size: 20px;
}
.showBox{
  width: 100%;
  height: 800px;
  border-radius: 10px;
  background-color: var(--color-soft-black);
  position: relative;
}


</style>