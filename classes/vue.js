import Model from "./model.js"
import { translate, zooming, rotate } from "./matrix.js"

export default class Vue {
  constructor(reader, canvas) {
    this.reader = reader
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
  }

  translateByMouse(x, y) {
    this.model.pointMatrix = translate(x, y, 0, this.model.pointMatrix)
    this.model.draw(this.ctx)
  }

  translate(direction) {
    switch (direction) {
      case "up":
        this.model.pointMatrix = translate(0, -10, 0, this.model.pointMatrix)
        break;

      case "down":
        this.model.pointMatrix = translate(0, 10, 0, this.model.pointMatrix)
        break;

      case "left":
        this.model.pointMatrix = translate(-10, 0, 0, this.model.pointMatrix)
        break;

      case "right":
        this.model.pointMatrix = translate(10, 0, 0, this.model.pointMatrix)
        break;

      default:
        this.center()
        break;
    }
    this.model.draw(this.ctx)
  }

  zoom(sens) {
    switch (sens) {
      case "in":
        this.model.pointMatrix = zooming(0.8, this.model.pointMatrix)
        break;

      case "out":
        this.model.pointMatrix = zooming(1.2, this.model.pointMatrix)
        break;

      default:
        this.fit()
        break;
    }
    this.center()
    this.model.draw(this.ctx)
  }

  rotateByMouse(x, y) {
    this.model.pointMatrix = rotate(x, y, 0, this.model.pointMatrix)
    this.center()
    this.model.draw(this.ctx)
  }

  rotate(direction) {
    switch (direction) {
      case "up":
        this.model.pointMatrix = rotate(-10, 0, 0, this.model.pointMatrix)
        break;

      case "down":
        this.model.pointMatrix = rotate(10, 0, 0, this.model.pointMatrix)
        break;

      case "left":
        this.model.pointMatrix = rotate(0, 10, 0, this.model.pointMatrix)
        break;

      case "right":
        this.model.pointMatrix = rotate(0, -10, 0, this.model.pointMatrix)
        break;

      default:
        this.model.pointMatrix = rotate(0, 0, 10, this.model.pointMatrix)
        break;
    }
    this.center()
    this.model.draw(this.ctx)
  }

  center() {
    const x = this.canvas.width / 2 - this.model.barycentre.x
    const y = this.canvas.height / 2 - this.model.barycentre.y
    this.model.pointMatrix = translate(x, y, 0, this.model.pointMatrix)
  }

  fit() {
    const teta = this.model.getAutoScale(this.canvas.width, this.canvas.height)
    this.model.pointMatrix = zooming(teta, this.model.pointMatrix)
  }

  loadFile() {
    this.reader.readFile().then(faces => {
      this.model = new Model(faces)
      this.fit()
      this.center()
      this.model.draw(this.ctx)
    })
  }

  toggleWireFrame() {
    this.model.showSegment = !this.model.showSegment
    this.model.draw(this.ctx)
  }

  togglePoint() {
    this.model.showPoint = !this.model.showPoint
    this.model.draw(this.ctx)
  }
}