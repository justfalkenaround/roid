'use strict';

/*------GENERIC VECTOR TYPE------*/
class Vector extends Interface {
  constructor(id = 'ANON-VECTOR') {
    super(id);
    this.dimensions = null;
  }

  /*------GET BASIC ARRAY VERSION------*/
  convertedTo(dimensions, args = [], id) {
    if (this.dimensions === dimensions) {
      this.log('CANNOT CONVERT TO SAME TYPE', 'WARN');
      return this;
    }
    else if (dimensions === 2) {
      return new Vec2(this.x, this.y, id);
    }
    else if (dimensions === 3) {
      return new Vec3(this.x, this.y, this.z = args[0], id);
    }
    else if (dimensions === 4) {
      return new Vec4(this.x, this.y, this.z = args[0], this.w = args[1], id);
    }
    else {
      this.log('INVALID INPUT', 'WARN');
      return this;
    }
  }

  /*------CROSS PRODUCT OF TWO 3D VECTORS------*/
  static crossProduct(v1, v2) {
    if (!(v1 instanceof Vec3) || !(v2 instanceof Vec3)) {
      this.log('CROSS PRUDUCT ONLY APPLIES TO 3D VECTORS', 'WARN');
      return;
    }
    const x = (v1.y * v2.z - v1.z * v2.y);
    const y = (v1.z * v2.x - v1.x * v2.z);
    const z = (v1.x * v2.y - v1.y * v2.x);
    return new Vec3(x, y, z);
  }

  /*------DOT PRODUCT OF TWO VECTORS -- ANY DIMENSION------*/
  static dotProduct(v1, v2) {
    if (!(v1 instanceof Vector) || !(v2 instanceof Vector)) {
      this.log('VECTOR DOT PRODUCT -- INVALID INPUT', 'WARN');
      return;
    }
    if ((v1 instanceof Vec4) && (v2 instanceof Vec4)) {
      return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    }
    else if ((v1 instanceof Vec3) && (v2 instanceof Vec3)) {
      return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    else if ((v1 instanceof Vec2) && (v2 instanceof Vec2)) {
      return v1.x * v2.x + v1.y * v2.y;
    }
    else {
      this.log('VECTOR DOT PRODUCT -- INVALID INPUT -- MUST BE OF SAME DIMENSION', 'WARN');
      return;
    }
  }
}