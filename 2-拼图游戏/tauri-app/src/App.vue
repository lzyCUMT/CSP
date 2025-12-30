<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { GridLayout, GridItem } from "vue3-drr-grid-layout";
import "vue3-drr-grid-layout/dist/style.css";
import { readImage } from './utils/readImage'
import { dialog } from '@tauri-apps/api';
interface layoutItem {
  x: number;
  y: number;
  w: number;
  h: number;
  i: number;
  keyX: number;
  keyY: number;
}
let layout: Ref<layoutItem[]> = ref([
  { x: 0, y: 0, w: 1, h: 1, i: 0, keyX: 0, keyY: 0 },
  { x: 1, y: 0, w: 1, h: 1, i: 1, keyX: 1, keyY: 0 },
  { x: 2, y: 0, w: 1, h: 1, i: 2, keyX: 2, keyY: 0 },
  { x: 0, y: 1, w: 1, h: 1, i: 3, keyX: 0, keyY: 1 },
  { x: 1, y: 1, w: 1, h: 1, i: 4, keyX: 1, keyY: 1 },
  { x: 2, y: 1, w: 1, h: 1, i: 5, keyX: 2, keyY: 1 },
  { x: 0, y: 2, w: 1, h: 1, i: 6, keyX: 0, keyY: 2 },
  { x: 1, y: 2, w: 1, h: 1, i: 7, keyX: 1, keyY: 2 },
  { x: 2, y: 2, w: 1, h: 1, i: 8, keyX: 2, keyY: 2 },
]);

const flags: number[] = new Array(9);
/**
 * @description 打乱图片顺序
 * @param array 
 */
const shuffleArray: (array: layoutItem[]) => void = (array: layoutItem[]) => {
  flags.fill(0);
  for (let i: number = array.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [array[i].x, array[j].x] = [array[j].x, array[i].x];
    [array[i].y, array[j].y] = [array[j].y, array[i].y];
  }
}

/** 
 * @description 处理文件
*/
const drawFile = (e: Event) => {
  let file: Blob;
  let files: FileList | null = (<HTMLInputElement>e.target).files;
  if (files) {
    file = files[0];
  } else {
    throw new Error('error');
  }
  // 判断是否图片，在移动端由于浏览器对调用file类型处理不同，虽然加了accept = 'image/*'，但是还要再次判断
  if (!/image\/\w+/.test(file.type)) {
    throw new Error('Type Error');
  }
  readImage(file)
    .then((res) => {
      drawToCanvas(res)
    })
}

/**
 * @description 渲染
 * @param imgData 
 */
const drawToCanvas = (imgData: any) => {
  const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement;      //现将图片放上去
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = imgData;
  if (ctx) {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 300, 300);
    }
  } else {
    throw new Error('error')
  }
  const newPhotoButton = document.querySelector(".newPhoto") as HTMLDivElement;
  newPhotoButton.onclick = function () {
    let q = 0;
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        let data: any = ctx?.getImageData(j * 100, i * 100, 100, 100);     // 类似于“复制”功能
        let img = document.querySelector(`#img${q}`) as HTMLCanvasElement;
        let newCtx = img?.getContext("2d");
        newCtx?.putImageData(data, 0, 0);    // 类似“粘贴”功能																																					
        q++;
      }
    }
  }
}
/**
 * @description 检查是否完成拼图
 * @param i 
 * @param newX 
 * @param newY 
 */
const checkCompleteness = (): void => {
  for (let i = 0; i < 9; i++) {
    if (layout.value[i].x !== layout.value[i].keyX || layout.value[i].y !== layout.value[i].keyY) {
      return;
    }
  }
  dialog.message('恭喜完成~');
}
const restore = (): void => {
  for (let i = 0; i < 9; i++) {
    layout.value[i].x = layout.value[i].keyX;
    layout.value[i].y = layout.value[i].keyY;
  }
}
</script>
<template>
  <div class="title">
    <h3>使用canvas实现九宫格切图的效果</h3>
    <input type="file" accept="image/*" @change="drawFile" id="imageInput">
    <div flex w-75 justify-between>
      <div class="newPhoto" bg="#1c1c1c" color-white p-2 mt-3>
        切割图片
      </div>
      <div class="changeOrder" @click="shuffleArray(layout)" bg="#1c1c1c" color-white p-2 mt-3>
        开始游戏
      </div>
      <div class="newPhoto" bg="#1c1c1c" color-white p-2 mt-3 @click="restore">
        还原
      </div>
    </div>

  </div>
  <div class="container">
    <div class="canvasBox">
      <canvas width="300" height="300" id="myCanvas"></canvas>
    </div>

    <grid-layout v-model:layout="layout" :col-num="3" :row-height="100" style="width: 350px; height: 350px;" :max-rows="3"
      :is-resizable="false" :auto-size="false">
      <template #default="{ gridItemProps }">
        <grid-item v-for=" item  in  layout " :key="item.i" v-bind="gridItemProps" :x="item.x" :y="item.y" :w="item.w"
          :h="item.h" :i="item.i" @moved="checkCompleteness">
          <canvas width="100" height="100" :id="`img${item.i}`" class='img'></canvas>
        </grid-item>
      </template>
    </grid-layout>

  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.newCanvas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  width: 300px;
  height: 300px;
  gap: 5px;
}

.container {
  margin-top: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px;
}

.newPhoto,
.changeOrder {
  cursor: pointer;
}
</style>
