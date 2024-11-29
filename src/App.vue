<script setup>
import { App, Group, Rect, Editor } from "leafer-editor"
// import { App, Group, Rect } from "leafer-ui"

var total = 100 // 100万个， 可设置个数

Rect.changeAttr("editable", true)

function create() {
  var app = new App({
    view: window,
    editor: new Editor(), // 会自动创建 editor实例、tree层、sky层
    usePartRender: false
  })

  var leafer = app.tree

  // 创建total
  var startTime = Date.now()
  createRect(leafer, total)
  var createTime = (Date.now() - startTime) / 1000

  // 布局与渲染
  startTime = Date.now()
  leafer.once("render.end", () => {
    var layoutAndRenderTime = (Date.now() - startTime) / 1000
    console.log(total, createTime, layoutAndRenderTime)
    // window.showResult()
  })
}

function createRect(view, num) {
  var space = 100 * 100 * 1.5
  var column = num > 25 ? 10 : 5
  var group
  for (var i = 0; i < num; i++) {
    group = new Group()
    group.x = space * (i % column)
    group.y = space * Math.floor(i / column)
    view.add(group)
    createBlock(group, 0, 0, `hsl(${i * 3},50%, 50%)`)
  }
}

// 创建1万个矩形
function createBlock(group, startX, startY, hsl) {
  var y, rect
  for (var i = 0; i < 100; i++) {
    if (i % 10 === 0) startX += 100
    y = startY
    for (var j = 0; j < 100; j++) {
      if (j % 10 === 0) y += 100
      rect = new Rect(null)
      rect.x = startX
      rect.y = y
      rect.height = 100
      rect.width = 100
      rect.fill = hsl
      rect.draggable = true
      group.add(rect)
      y += 120
    }
    startX += 120
  }
}

window.onload = function () {
  create()
}
// import { App, Rect, Editor } from "leafer-editor"

// const app = new App({ view: window })

// app.tree = app.addLeafer()
// app.sky = app.addLeafer({ type: "draw", usePartRender: false })

// app.editor = new Editor()
// app.sky.add(app.editor)
// const size = 10000
// for (let i = 0; i < size; i++) {
//   const x = Math.random() * size
//   const y = Math.random() * size
//   app.tree.add(Rect.one({ editable: true, stroke: "#f00" }, x, y))
// }
</script>

<template></template>

<style scoped></style>
