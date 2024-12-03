import {
  Application,
  Container,
  Graphics,
  Text,
  MeshSimple,
  Sprite,
  Point,
  Texture,
} from "pixi.js"
import OSD from "openseadragon"
import _ from "lodash"

// 主类
export class Moli {
  options
  app
  container
  polygonGraphics
  pointGraphics
  shapes = []

  constructor(options) {
    this.options = options // { viewer, shapes, onAdd, onUpdate, onRemove }
    this.init()
  }

  // 初始化
  async init() {
    const app = new Application()
    this.app = app
    await app.init({ resizeTo: this.options.viewer.canvas, backgroundAlpha: 0 })
    this.options.viewer.canvas.appendChild(app.canvas)
    app.canvas.style.pointerEvents = "none"
    app.canvas.style.position = "absolute"
    app.canvas.style.top = "0"
    app.canvas.style.left = "0"
    const container = new Container() // 容器
    const polygonGraphics = new Graphics() // 多边形
    const pointGraphics = new Graphics() // 点
    this.container = container
    this.polygonGraphics = polygonGraphics
    this.pointGraphics = pointGraphics
    container.addChild(polygonGraphics)
    container.addChild(pointGraphics)
    app.stage.addChild(container)
    this.addShapes(this.options.shapes || [])
    app.ticker.add(() => {
      this.update()
    })
  }

  // 添加shapes
  addShapes(shapes) {
    this.shapes.push(...shapes)
    for (const v of shapes) {
      this.addShapes(v)
    }

    // // 渲染100个矩形
    // for (let i = 0; i < 1000; i++) {
    //   const x = Math.random() * 10000
    //   const y = Math.random() * 10000
    //   const rect = { x, y, w: 100, h: 100 }
    //   this.polygonGraphics.rect(rect.x, rect.y, rect.w, rect.h)
    //   this.polygonGraphics.stroke({
    //     width: 2,
    //     color: this.options.color || "f00",
    //   })
    // }
    //  graphics.stroke({ width: 2, color: 0xff0000, pixelLine: true })
    //  // 渲染100个矩形 END
    //  // 渲染10000个点
    //  const points = []
    //  for (let i = 0; i < 100000; i++) {
    //    const x = Math.random() * 10000
    //    const y = Math.random() * 10000
    //    const point = { x, y }
    //    points.push(point)
    //    graphics.circle(point.x, point.y, 5)
    //    graphics.fill({ color: 0x650a5a, alpha: 1 })
    //    graphics.stroke({ width: 2, color: 0xfeeb77 })
    //  }
    //  graphics.stroke({ width: 2, color: 0xff0000, pixelLine: true })
    //  // 渲染100000个点END
  }

  // 帧更新
  update() {
    const viewport = this.options.viewer.viewport
    const flipped = viewport.getFlip()
    const p = viewport.pixelFromPoint(new OSD.Point(0, 0), true)
    if (flipped) {
      p.x = viewport._containerInnerSize.x - p.x
    }
    // 获取比例
    const getScale = () => {
      const containerWidth = this.options.viewer.viewport.getContainerSize().x
      const zoom = this.options.viewer.viewport.getZoom(true)
      return (
        (zoom * containerWidth) / this.options.viewer.world.getContentFactor()
      )
    }
    const scaleY = getScale()
    const scaleX = flipped ? -scaleY : scaleY
    const rotation = viewport.getRotation()
    const strokeWidth = 2 / scaleY

    this.container.x = p.x
    this.container.y = p.y
    this.container.scale = scaleY
    this.container.rotation = rotation

    // console.log(strokeWidth)

    // this.polygonGraphics.stroke({
    //   width: 2,
    //   color: this.options.color || "f00",
    // })
    // this.polygonGraphics.stroke({ width: strokeWidth, color: "00f" })
      // 渲染100个矩形
      // this.polygonGraphics.clear()
      // for (let i = 0; i < 100; i++) {
      //   const x = Math.random() * 10000
      //   const y = Math.random() * 10000
      //   const rect = { x, y, w: 100, h: 100 }
      //   this.polygonGraphics.rect(rect.x, rect.y, rect.w, rect.h)
      //   this.polygonGraphics.stroke({
      //     width: strokeWidth,
      //     color: this.options.color || "f00",
      //   })
      // }
  }

  // 销毁
  destroy() {}
}

// 创建Moli
export const createMoli = (options) => {
  return new Moli(options)
}
