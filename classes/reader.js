import Point from "./point.js"
import Segment from "./segment.js"
import Face from "./face.js"

export default class Reader {
  constructor(path) {
    this.path = path
  }

  async readFile() {
    const file = await fetch(this.path).then(res => res.text())
    const ligne = file.split("\n")

    const info = this.readHeader(ligne)
    const points = this.readPoint(ligne, info)
    const faces = this.readFace(ligne, { ...info, ...points })

    return faces
  }

  readHeader(ligne) {
    let i = 0
    const info = new Map()

    while (i < ligne.length && ligne[i].trim() !== "end_header") {
      if (ligne[i].includes("element")) {
        const parsedLigne = ligne[i].split(" ")

        if (parsedLigne[1].toLowerCase() === "vertex") {
          info.set("vertex", Number.parseInt(parsedLigne[2]))
        } else if (parsedLigne[1].toLowerCase() === "face") {
          info.set("face", Number.parseInt(parsedLigne[2]))
        }
      }
      i++
    }    
    return { element: info, lastLine: i }
  }

  readPoint(ligne, info) {
    let i = info.lastLine + 1, coord
    const stop = i + info.element.get("vertex"), points = []

    while (i < ligne.length && i < stop) {
      coord = ligne[i].split(" ").map(x => Number.parseFloat(x))
      points.push(new Point(coord[0], -1 * coord[1], -1 * coord[2]))
      i++
    }

    return { points, lastLine: i }
  }

  readFace(ligne, info) {
    let i = info.lastLine, segments = [], coord
    const stop = i + info.element.get("face"), faces = []


    while (i < ligne.length && i < stop) {
      coord = ligne[i].split(" ")
        .map(x => Number.parseInt(x))
        .filter(x => !Number.isNaN(x))

      for (let k = 1; k < coord[0] + 1; k++) {
        if (k === coord[0]) {
          segments.push(new Segment(info.points[coord[k]], info.points[coord[1]]))
        } else {
          segments.push(new Segment(info.points[coord[k]], info.points[coord[k + 1]]))
        }
      }
      faces.push(new Face(segments))
      segments = []
      i++
    }
    return faces
  }
}