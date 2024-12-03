<script setup>
import _ from "lodash"
import OSD from "openseadragon"
import { onMounted, reactive, ref, computed } from "vue"
import { defaultShapes } from "@/tools/default-shapes"
import { defaultOsdConf } from "@/tools/default-osd-conf"
import { randomPoints } from "@/tools"
import { Moli } from "@/moli"
import { useFps } from "@vueuse/core"

const fps = useFps() // fps

const osdRef = ref(null) // osd dom

const state = reactive({
  viewer: null, // osd 查看器
  moli: null, // moli对象
  shapes: [], // 图形列表
})
// 初始化painter
const initMoli = () => {
  const options = {
    viewer: state.viewer, // osd 查看器
    shapes: state.shapes, // 图形列表
    // 监听新增形状
    onAdd: (shape) => {
      state.shapes.push(shape)
    },
    // 监听删除形状
    onRemove: (shape) => {
      state.shapes = state.shapes.filter((item) => item.id !== shape.id)
    },
    // 监听更新形状
    onUpdate: (shape) => {
      for (const k in state.shapes) {
        if (state.shapes[k].id === shape.id) {
          state.shapes[k] = shape
        }
      }
    },
  }
  state.moli = new Moli(options)
}
// 初始化osd
const initViewer = () => {
  const tileSources =
    "http://openseadragon.github.io/example-images/duomo/duomo.dzi"
  const options = {
    ..._.cloneDeep(defaultOsdConf),
    element: osdRef.value,
    tileSources, // 瓦片源
  }
  state.viewer = new OSD.Viewer(options)
}
// 渲染默认的 shapes
const renderShapes = () => {}
onMounted(() => {
  // 初始化osd
  initViewer()
  state.viewer.addHandler("open", () => {
    // 初始化 painter
    initMoli()
    // 渲染默认的 shapes
    renderShapes()
  })
})
</script>

<template>
  <div class="moli">
    <div class="menu common-box"></div>
    <div class="main">
      <div ref="osdRef" class="osd common-box"></div>
      <div class="debug common-box"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.moli {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f1f1f1;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  .common-box {
    border-radius: 10px;
    background-color: #fff;
    overflow: hidden;
  }
  .menu {
    width: 300px;
    flex-shrink: 0;
    margin-right: 20px;
  }
  .main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .osd {
      flex-grow: 1;
    }
    .debug {
      margin-top: 20px;
      height: 50px;
      flex-shrink: 0;
    }
  }
}
</style>
