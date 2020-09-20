const translation = function (x, y, z) {
  return math.matrix([
    [1, 0, 0, x],
    [0, 1, 0, y],
    [0, 0, 1, z],
    [0, 0, 0, 1]
  ])
}

const zoom = function (teta) {
  return math.matrix([
    [teta, 0, 0, 0],
    [0, teta, 0, 0],
    [0, 0, teta, 0],
    [0, 0, 0, 1]
  ])
}

const rotateX = function (deg) {
  const rad = Math.PI * deg / 180;
  return math.matrix([
    [1, 0, 0, 0],
    [0, Math.cos(rad), -1 * Math.sin(rad), 0],
    [0, Math.sin(rad), Math.cos(rad), 0],
    [0, 0, 0, 1]
  ])
}

const rotateY = function (deg) {
  const rad = Math.PI * deg / 180;
  return math.matrix([
    [Math.cos(rad), 0, Math.sin(rad), 0],
    [0, 1, 0, 0],
    [-1 * Math.sin(rad), 0, Math.cos(rad), 0],
    [0, 0, 0, 1]
  ])
}

const rotateZ = function (deg) {
  const rad = Math.PI * deg / 180;
  return math.matrix([
    [Math.cos(rad), -1 * Math.sin(rad), 0, 0],
    [Math.sin(rad), Math.cos(rad), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ])
}

export function translate(x, y, z, m) {
  return math.multiply(translation(x, y, z), m)
}

export function zooming(teta, m) {
  return math.multiply(zoom(teta), m)
}

export function rotate(x, y, z, m) {
  return math.multiply(rotateX(x), rotateY(y), rotateZ(z), m)
}