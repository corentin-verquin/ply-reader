import Point from "./point.js"
import Vecteur from "./vecteur.js"

export default class Model {

  constructor(faces) {
    this.faces = faces
    this.lumiere = Vecteur.directInstance(0, 0, 1)
    this.showSegment = document.querySelector("input#segment").checked
    this.showPoint = document.querySelector("input#point").checked    
  }

  sort() {
    // on ordonne les faces pour dessiner les plus éloigner en premier
  // compare to basique basé sur le Z du barycentre    
    this.faces = this.faces.sort((a, b) => {
      const barA = a.barycentre
      const barB = b.barycentre
      if (barA.z > barB.z) {
        return -1
      } else if (barA.z > barB.z) {
        return 1
      } else {
        return 0
      }
    })
  }

  get barycentre() {
    let x = 0, y = 0, z = 0
    const count = this.faces.length
    for (let s of this.faces) {
      x += s.barycentre.x
      y += s.barycentre.y
      z += s.barycentre.z
    }
    return new Point(x / count, y / count, z / count)
  }

  draw(ctx) {    
    this.sort()
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let i = 0    
    for (let face of this.faces) {

      //dessin des faces et des segments
      ctx.beginPath()
      for (let i = 0; i < face.segments.length; i++) {
        const segment = face.segments[i];
        if (i === 0) {
          ctx.moveTo(segment.point1.x, segment.point1.y)
        }
        ctx.lineTo(segment.point2.x, segment.point2.y)
      }
      ctx.closePath()
      if (!this.showSegment) {
        ctx.fillStyle = face.couleur(this.lumiere)
        ctx.fill()
      } else {
        ctx.stroke()
      }

      if (this.showPoint) {
        //dessin des points
        for (let i = 0; i < face.segments.length; i++) {
          const segment = face.segments[i];
          ctx.fillStyle = 'red'
          ctx.beginPath()
          ctx.arc(segment.point1.x, segment.point1.y, 2, 0, Math.PI * 2)
          ctx.closePath()
          ctx.fill()
        }
      }
    }
  }

  get pointMatrix() {
    if (!this._matrix) {
      const x = [], y = [], z = [], v = []
      let point
      for (let face of this.faces) {
        for (let segment of face.segments) {
          point = segment.point1
          x.push(point.x)
          y.push(point.y)
          z.push(point.z)
          v.push(1)
        }
      }
      this._matrix = math.matrix([x, y, z, v])
    }

    return this._matrix
  }

  set pointMatrix(matrix) {
    this._matrix = matrix
    let index = 0

    for (let i = 0; i < this.faces.length; i++) {
      //redifine all start point of segment
      for (let j = 0; j < this.faces[i].segments.length; j++) {
        index = i * this.faces[i].segments.length + j
        this.faces[i].segments[j].point1 = new Point(
          matrix._data[0][index],
          matrix._data[1][index],
          matrix._data[2][index]
        )
      }
      //redifine all end point of segment
      for (let j = 0; j < this.faces[i].segments.length; j++) {
        if (j < this.faces[i].segments.length - 1) {
          this.faces[i].segments[j].point2 = this.faces[i].segments[j + 1].point1
        } else {
          this.faces[i].segments[j].point2 = this.faces[i].segments[0].point1
        }
      }
    }
  }

  getAutoScale(w, h) {
    let xMin = Number.MAX_SAFE_INTEGER, xMax = Number.MIN_SAFE_INTEGER
    let yMin = Number.MAX_SAFE_INTEGER, yMax = Number.MIN_SAFE_INTEGER

    const points = this.pointMatrix._data

    for (let i = 0; i < points[0].length; i++) {
      if (points[0][i] < xMin) xMin = points[0][i]
      if (points[0][i] > xMax) xMax = points[0][i]

      if (points[1][i] < yMin) yMin = points[1][i]
      if (points[1][i] > yMax) yMax = points[1][i]
    }

    let scaleX = (w - 75) / (xMax - xMin)
    let scaleY = (h - 75) / (yMax - yMin)

    return scaleX < scaleY ? scaleX : scaleY
  }
}