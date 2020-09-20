import Point from "./point.js"
import Vecteur from "./vecteur.js"

export default class face {
  constructor(segments) {
    this.segments = segments
  }

  initVecteur() {
    this.v1 = new Vecteur(
      this.segments[0].point1,
      this.segments[0].point2
    )
    this.v2 = new Vecteur(
      this.segments[this.segments.length - 1].point1,
      this.segments[this.segments.length - 1].point2
    )
  }

  couleur(lumiere) {
    this.initVecteur()
    const ratio = Vecteur.calculCouleur(lumiere, this.v1, this.v2)
    const hex = ratio.toString(16)
    return `#${hex}${hex}${hex}`
  }

  get barycentre() {
    let x = 0, y = 0, z = 0
    const count = this.segments.length
    for (let s of this.segments) {
      x += s.point1.x
      y += s.point1.y
      z += s.point1.z
    }
    return new Point(x / count, y / count, z / count)
  }
}