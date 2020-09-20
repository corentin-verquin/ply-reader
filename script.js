import Reader from "./classes/reader.js"
import Vue from "./classes/vue.js"

/*##################
Affichage par défaut
####################*/
const canvas = document.getElementById("myCanvas")
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight - 205
document.querySelector(".menu").style.opacity = "1"

const reader = new Reader("model/beethoven.ply")
const vue = new Vue(reader, canvas)
vue.loadFile()

/*##################
Gestion de la souris
##################*/
let flag = false, posX = 0, posY = 0, cliqueGauche = false, cliqueDroit = false
canvas.addEventListener("contextmenu", e => {
  e.preventDefault()
})

canvas.addEventListener("mousemove", e => {
  if (flag) {
    if (cliqueGauche) vue.translateByMouse(e.x - posX, e.y - posY)

    if (cliqueDroit) vue.rotateByMouse(e.y - posY, posX - e.x)

    posX = e.x
    posY = e.y
  }
})
canvas.addEventListener("mousedown", e => {
  posX = e.x
  posY = e.y
  if (e.which === 1) cliqueDroit = true
  if (e.which === 3) cliqueGauche = true
  flag = true
})
canvas.addEventListener("mouseleave", e => { flag = false })
canvas.addEventListener("mouseup", e => {
  flag = false
  cliqueGauche = false
  cliqueDroit = false
})

canvas.addEventListener("wheel", e => {
  if (e.deltaY > 0) {
    vue.zoom("in")
  } else {
    vue.zoom("out")
  }
})

/*##################
Gestion du menu
##################*/
document.querySelector("#mySelect").addEventListener("change", e => {
  reader.path = "model/" + e.target.value
  vue.loadFile()
})

document.querySelector("input#segment").addEventListener("change", e => { vue.toggleWireFrame() })
document.querySelector("input#point").addEventListener("change", e => { vue.togglePoint() })

let mousedownID = -1
const mouseDown = (e) => {
  if (mousedownID == -1)
    mousedownID = setInterval(() => whilemousedown(e), 100);
}

const mouseUp = (e) => {
  if (mousedownID != -1) {
    clearInterval(mousedownID);
    mousedownID = -1;
  }
}

const whilemousedown = (e) => {
  const button = e.target.closest("button")
  switch (button.dataset.action) {
    case "translate":
      vue.translate(button.dataset.direction)
      break;
    case "zoom":
      vue.zoom(button.dataset.sens)
      break
    case "rotate":
      vue.rotate(button.dataset.direction)
      break;
    default:
      break;
  }
}

document.querySelectorAll(".menu button").forEach(btn => {
  btn.addEventListener("mousedown", mouseDown)
  btn.addEventListener("mouseup", mouseUp)
  btn.addEventListener("mouseout", mouseUp)
})