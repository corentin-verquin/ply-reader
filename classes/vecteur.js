import Point from "./point.js"

export default class Vecteur {
  constructor(point1, point2) {
    this.x = point1.x - point2.x
    this.y = point1.y - point2.y
    this.z = point1.z - point2.z
  }

  static directInstance(x, y, z) {
    const point1 = new Point(x, y, z)
    const point2 = new Point(0, 0, 0)
    return new Vecteur(point1, point2)
  }

  static produitVectoriel(v1, v2) {
    const X = (v1.y * v2.z) - (v1.z * v2.y)
    const Y = -((v1.x * v2.z) - (v1.z * v2.x))
    const Z = (v1.x * v2.y) - (v1.y * v2.x)
    return this.directInstance(X, Y, Z)
  }

  static produitScalaire(v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
  }

  norme() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
  }

  static cosVectoriel(v1, v2) {
    const num = this.produitScalaire(v1, v2);
    const denum = v1.norme() * v2.norme();
    return Math.abs(num / denum);
  }

  static calculCouleur(lumiere, v1, v2) {
    const normal = this.produitVectoriel(v1, v2);
    const pourcentage = this.cosVectoriel(lumiere, normal);
    return Math.trunc(pourcentage * 255);
  }
}