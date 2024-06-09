<script setup>
import {ref, onMounted, onUnmounted, watch} from 'vue';

const isDraggingLeft = ref(false);
const isDraggingTop = ref(false);
const isDraggingRight = ref(false);
const isDraggingBottom = ref(false);

const position = ref({
  left: 50,
  top: 50,
  right: 50,
  bottom: 50,
})

const radiusBox = ref(null)

const handleMouseDown = (event, type) => {
  if (radiusBox.value) {
    const rect = radiusBox.value.getBoundingClientRect()
    switch (type) {
      case 'left':
        isDraggingLeft.value = true;
        position.value.left = Math.round((event.clientY - rect.top) / radiusBox.value.offsetHeight * 100)
        break
      case 'top':
        isDraggingTop.value = true;
        position.value.top = Math.round((event.clientX - rect.left) / radiusBox.value.offsetWidth * 100)
        break
      case 'right':
        isDraggingRight.value = true;
        position.value.right = Math.round((event.clientY - rect.top) / radiusBox.value.offsetHeight * 100)
        break
      case 'bottom':
        isDraggingBottom.value = true;
        position.value.bottom = Math.round((event.clientX - rect.left) / radiusBox.value.offsetWidth * 100)
        break
      default:
        break
    }
  }
};


const handleMouseMove = (event) => {
  const rect = radiusBox.value.getBoundingClientRect()
  if (isDraggingLeft.value && radiusBox.value) {
    position.value.left = Math.round((event.pageY - rect.top) / radiusBox.value.offsetHeight * 100)
    position.value.left = checkVal(position.value.left)
  }
  if (isDraggingTop.value && radiusBox.value) {
    position.value.top = Math.round((event.pageX - rect.left) / radiusBox.value.offsetWidth * 100)
    position.value.top = checkVal(position.value.top)
  }
  if (isDraggingRight.value && radiusBox.value) {
    position.value.right = Math.round((event.pageY - rect.top) / radiusBox.value.offsetHeight * 100)
    position.value.right = checkVal(position.value.right)
  }
  if (isDraggingBottom.value && radiusBox.value) {
    position.value.bottom = Math.round((event.pageX - rect.left) / radiusBox.value.offsetWidth * 100)
    position.value.bottom = checkVal(position.value.bottom)
  }

}

const checkVal = val => {
  if (val >= 100) return 100
  else if (val <= 0) return 0
  else return val

}


const handleMouseUp = () => {
  isDraggingLeft.value = false;
  isDraggingTop.value = false;
  isDraggingRight.value = false;
  isDraggingBottom.value = false;
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});

const modelBoxStyle = ref({
  'border-radius': '50% 50% 50% 50% / 50% 50% 50% 50%'
})

watch(() => position, () => {
  modelBoxStyle.value['border-radius'] = `${position.value.top}% ${100-position.value.top}% ${100-position.value.bottom}% ${position.value.bottom}% / ${position.value.left}% ${position.value.right}% ${100-position.value.right}% ${100-position.value.left}%`
},{
  deep: true,
})
</script>

<template>
  <article>
    <div class="visualRadius">
      <div class="radiusBox" ref="radiusBox">
        <div class="modelBox"
             :style="modelBoxStyle">
        </div>
        <ul>
          <li :class="{left:true, active: isDraggingLeft}" @mousedown="handleMouseDown($event, 'left')" :style="{ top: `${position.left}%`}"></li>
          <li :class="{top:true, active: isDraggingTop}" @mousedown="handleMouseDown($event, 'top')" :style="{ left: `${position.top}%`}"></li>
          <li :class="{right:true, active: isDraggingRight}" @mousedown="handleMouseDown($event, 'right')" :style="{ top: `${position.right}%`}"></li>
          <li :class="{bottom:true, active:isDraggingBottom}" @mousedown="handleMouseDown($event, 'bottom')"
              :style="{ left: `${position.bottom}%`}"></li>
        </ul>
      </div>
      <div class="consoleTab">
        <div class="detailInfo">
          <div class="attrBox" v-for="attr in Object.keys(modelBoxStyle)">
            <div class="attr">{{ attr }}</div>
            <div class="value">{{ modelBoxStyle[attr] }}</div>
          </div>

        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.visualRadius{
  width: 700px;
  background-color: white;
  padding-top: 30px;
}
.visualRadius .consoleTab .detailInfo{
  padding: 20px
}
.visualRadius .consoleTab .detailInfo .attrBox{
  display: flex;
  align-items: center;
  background-color: #CFD3DC;
  margin: 10px;
  padding: 5px;
  border-radius: 5px;
  font-family: 'mono', sans-serif;
}
.visualRadius .consoleTab .detailInfo .attrBox .attr{
  width: 25%;
  font-size: 18px;
  text-align: center;
  color: white;
  font-weight: bolder;
}
.visualRadius .consoleTab .detailInfo .attrBox .value{
  width: 70%;
  background-color: #c8c8c8;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
}

.radiusBox {
  margin: 0 auto;
  width: 652px;
  height: 652px;
  border: 1px black dashed;
  background-color: transparent;
  position: relative;
}

.radiusBox ul {
  list-style: none;
}

.radiusBox ul li {
  position: absolute;
  cursor: pointer;
}

.radiusBox ul li::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  width: 14px;
  height: 14px;
  background-color: #fff;
  border: 1px solid black;
}
.radiusBox ul li:hover:before {
  transition: all 0.3s;
  top: -9px;
  left: -9px;
  border: 2px solid black;
  background-color: darkcyan;
}
.radiusBox ul .active::before {
  transition: all 0.3s;
  top: -9px;
  left: -9px;
  border: 2px solid black;
  background-color: darkcyan;
}

.radiusBox ul .left {
  top: 50%;
}

.radiusBox ul .right {
  top: 50%;
  left: 100%;
}

.radiusBox ul .top {
  top: 0;
  left: 50%;
}

.radiusBox ul .bottom {
  top: 100%;
  left: 50%;
}

.radiusBox .modelBox {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(lightblue, lightgreen);
}
</style>
