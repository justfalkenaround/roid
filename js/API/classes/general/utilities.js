'use strict';

/*------SET OF STATIC UTILITY METHODS------*/
class Utilities extends Interface {
  constructor(id = 'ANON-UTILITIES') {
    super(id);
  }

  /*------CLAMP WITHIN RANGE------*/
  static clamp(value, min, max) {
    if (value < min) {
      return min;
    }
    else if (value > max) {
      return max;
    }
    else {
      return value;
    }
  }

  /*------COMBINATION ALGORITHM------*/
  static combination(over, under) {
    let setOne = [];
    let setTwo = [];
    let resultOne;
    let resultTwo;
    for (let i = 0; i < (over - (over - under)); i++) {
      setOne.push(over - i);
    }
    for (let i = 0; i < under; i++) {
      setTwo.push(under - i);
    }
    for (let i = 0; i < setOne.length; i++) {
      if (i === 1) {
        resultOne = (setOne[0] * setOne[i]);
        resultTwo = (setTwo[0] * setTwo[i]);
      }
      else {
        resultOne *= setOne[i];
        resultTwo *= setTwo[i];
      }
    }
    return (resultOne / resultTwo);
  }

  /*------RGB => -1 <=> 1------*/
  static fromRGB(color) {
    return color.map(c => c / 255);
  }

  /*------ -1 <=> 1 => RGB------*/
  static toRGB(color) {
    return color.map(c => c * 255);
  }

  /*------CONVERT RADIAN ANGLE TO DEGREES------*/
  static angleToDegrees(ang) {
    return ang * (Math.PI / 180);
  }

  /*------CONVERT DEGREE ANGLE TO RADIANS------*/
  static angleToRadians(ang) {
    return ang * (180 / Math.PI);
  }

  /*------AXIS GENERATOR------*/
  static buildAxis(size) {
    let dat = {
      indices: [0, 1, 2, 3, 4, 5],
      vertices: [
        -size, 0.0, 0.0,
        size, 0.0, 0.0,
        0.0, -size / 2, 0.0,
        0.0, size / 2, 0.0,
        0.0, 0.0, -size,
        0.0, 0.0, size
      ],
      descriptor: 'AXIS',
      color: [1, 0, 0, 1],
    };
    return new Geometry(dat);
  }

  /*------WALL GENERATOR------*/
  static buildWalls() {
    return new Geometry({
      vertices: [
        -20, -8, 20,
        -10, -8, 0,
        10, -8, 0,
        20, -8, 20,
        -20, 8, 20,
        -10, 8, 0,
        10, 8, 0,
        20, 8, 20,
      ],
      indices: [
        0, 5, 4,
        1, 5, 0,
        1, 6, 5,
        2, 6, 1,
        2, 7, 6,
        3, 7, 2,
      ],
      renderingMode: 'TRIANGLES',
      descriptor: 'WALLS',
      color: [0.3, 1, 0, 1],
      flatShading: true,
      rotationVelocity: [0, 0, 0.01],
      shininess: 0,
    });
  }

  /*------TRAIL GENERATOR----*/
  static buildTrail(density = 5, radius = 1, id = 'ANON-SPHERE') {
    let v = [];
    let i = [];
    let r = radius;
    let colors = [];
    let degs = (density * 2) / 360;
    let deg = 0;
    for (let j = 0; j < density * 2; j++) {
      deg += degs;
      let rads = (deg * Math.PI) / 180;
      let x = r * Math.sin(rads) * Math.cos(deg);
      let y = r * Math.sin(rads) * Math.sin(deg);
      let z = r * deg * deg; // CHANGE THIS TO ACHIEVE WIDER SPIRAL
      v.push(x);
      v.push(y);
      v.push(z);
      colors.push(Math.random());
      colors.push(Math.random());
      colors.push(Math.random());
      colors.push(1);
    }
    for (let m = 0; m < v.length / 3; m++) {
      i.push(m);
    }
    return new Geometry({
      vertices: v,
      indices: i,
      descriptor: 'SPHERE',
      colors: colors,
      renderingMode: 'LINE_LOOP',
    }, id);
  }

  /*------GRAPH POINTS ON A SPHERE------*/
  static buildSphere(density = 5, radius = 1, id = 'ANON-SPHERE') {
    let v = [];
    let i = [];
    let r = radius;
    let colors = [];
    let degs = (density * 2) / 360;
    let deg = 0;
    for (let j = 0; j < density * 2; j++) {
      deg += degs;
      let rads = (deg * Math.PI) / 180;
      let x = r * Math.sin(rads) * Math.cos(deg);
      let y = r * Math.sin(rads) * Math.sin(deg);
      let z = r * Math.cos(rads);
      v.push(x);
      v.push(y);
      v.push(z);
      colors.push(Math.random());
      colors.push(Math.random());
      colors.push(Math.random());
      colors.push(1);
    }
    for (let m = 0; m < v.length / 3; m++) {
      i.push(m);
    }
    return new Geometry({
      vertices: v,
      indices: i,
      descriptor: 'SPHERE',
      colors: colors,
      renderingMode: 'LINES',
    }, id);
  }

  /*------CONE GENERATOR -- DOES NOT CREATE A VALID CONE BUT STILL DOES SOMETHING ------*/
  static buildCone(sides = 3, size = 1, color = [1, 1, 1, 1], id = 'ANON-CONE') {
    let v = [0, 1 * size, 0,];
    let i = [];
    let degs = sides / 360;
    let deg = 0;
    for (let j = 1; j < sides + 2; j++) {
      deg += degs;
      let rads = (deg * Math.PI) / 180;
      let x = (size) * Math.sin(rads) * Math.cos(deg);
      let y = -1 * size;
      let z = (size) * Math.cos(rads) * Math.sin(deg);
      v.push(x);
      v.push(y);
      v.push(z);
    }
    for (let j = 3; j < (v.length / 3); j += 3) {
      i.push(0);
      i.push(j - 1);
      i.push(j - 2);
    }
    return new Geometry({
      vertices: v,
      indices: i,
      descriptor: 'CONE',
      color: color,
      renderingMode: 'TRIANGLES',
    }, id);
  }

  /*------MAP INDICES ARRAY TO THROUGH THE SHORTEST PATH -- REQUIRES TESTING ------*/
  static _shortestPath(v) {
    let tV = [];
    let i = [];
    let negated = [];
    for (let c = 0; c < v.length / 3; c += 3) {
      tV.push(new Vec3(v[c], v[c + 1], v[c + 2]));
    }
    for (let m = 0; m < tV.length; m++) {
      let shortest = Infinity;
      let idx = null;
      for (let d = 0; d < tV.length; d++) {
        if (d === m) {
          continue;
        }
        const distance = tV[m].distance(tV[d]);
        if (distance < shortest && negated.indexOf(d) === -1) {
          shortest = distance;
          idx = d;
        }
      }
      i.push(idx);
      negated.push(m);
    }
    return i;
  }

  /*------GENERATE RANDOM VECTOR -1 <=> 1 ------*/
  static randomClipVector(mult = 1, min = 0) {
    let vec = new Vec3(Math.random() * mult + min, Math.random() * mult + min, Math.random() * mult + min);
    if (Math.random() > 0.5) {
      vec.x = -vec.x;
    }
    if (Math.random() > 0.5) {
      vec.y = -vec.y;
    }
    if (Math.random() > 0.5) {
      vec.z = -vec.z;
    }
    return vec;
  }
}