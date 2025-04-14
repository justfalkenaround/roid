'use strict';

/*------THREE DIMENSIONAL VECTOR------*/
class Vec4 extends Vector {
  constructor(x = 0, y = 0, z = 0, w = 1, id = 'ANON-VEC4') {
    super(id);
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.dimensions = 4;
  }

  /*------GET BASIC ARRAY VERSION------*/
  get array() {
    return [this.x, this.y, this.z, this.w];
  }

  /*------RETURN COPY------*/
  copy(id) {
    return new Vec4(this.x, this.y, this.z, this.w, id);
  }

  /*------COMPARISON OF EQUAL TYPE------*/
  equals(input = null) {
    if (!(input instanceof Vec4)) {
      this.log('CANNOT COMPARE VEC(n) AGAINST OTHER TYPE', 'WARN');
      return false;
    }
    return (this.x === input.x && this.y === input.y && input.z === this.z && input.w === this.w);
  }

  /*------SET VALUES TO ZERO------*/
  zero() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
  }

  /*------ADD -- ALTERS ORIGINAL------*/
  add(input = null, second = null, third = null, fourth = null) {
    if (input instanceof Vec4) {
      this.x += input.x;
      this.y += input.y;
      this.z += input.z;
      this.w += input.w;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x += input;
      this.y += input;
      this.z += input;
      this.w += input;
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number' && typeof fourth === 'number') {
      this.x += input;
      this.y += second;
      this.z += third;
      this.w += fourth;
    }
    else {
      this.log('VECTOR ADDITION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------ADD -- DOES NOT ALTER ORIGINAL------*/
  plus(input = null, second = null, third = null, fourth = null) {
    const ret = this.copy();
    ret.add(input, second, third, fourth);
    return ret;
  }

  /*------SUBTRACT -- ALTERS ORIGINAL------*/
  subtract(input = null, second = null, third = null, fourth = null) {
    if (input instanceof Vec4) {
      this.x -= input.x;
      this.y -= input.y;
      this.z -= input.z;
      this.w -= input.w;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x -= input;
      this.y -= input;
      this.z -= input;
      this.w -= input;
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number' && typeof fourth === 'number') {
      this.x -= input;
      this.y -= second;
      this.z -= third;
      this.w -= fourth;
    }
    else {
      this.log('VECTOR SUBTRACTION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------SUBTRACT -- DOES NOT ALTER ORIGINAL------*/
  minus(input = null, second = null, third = null, fourth = null) {
    const ret = this.copy();
    ret.subtract(input, second, third, fourth);
    return ret;
  }

  /*------DIVIDE -- ALTERS ORIGINAL------*/
  divide(input = null, second = null, third = null, fourth = null) {
    if (input instanceof Vec4) {
      this.x /= input.x;
      this.y /= input.y;
      this.z /= input.z;
      this.w /= input.w;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x /= input;
      this.y /= input;
      this.z /= input;
      this.w /= input;
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number' && typeof fourth === 'number') {
      this.x /= input;
      this.y /= second;
      this.z /= third;
      this.w /= fourth;
    }
    else {
      this.log('VECTOR DIVISION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------DIVIDE -- NOES NOT ALTER ORIGINAL------*/
  dividedBy(input = null, second = null, third = null, fourth = null) {
    const ret = this.copy();
    ret.divide(input, second, third, fourth);
    return ret;
  }

  /*------MULTIPLY -- ALTERS ORIGINAL------*/
  multiply(input = null, second = null, third = null, fourth = null) {
    if (input instanceof Vec4) {
      this.x *= input.x;
      this.y *= input.y;
      this.z *= input.z;
      this.w *= input.w;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x *= input;
      this.y *= input;
      this.z *= input;
      this.w *= input;
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number' && typeof fourth === 'number') {
      this.x *= input;
      this.y *= second;
      this.z *= third;
      this.w *= fourth;
    }
    else {
      this.log('VECTOR MULTIPLICATION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------MULTIPLY -- NOES NOT ALTER ORIGINAL------*/
  times(input = null, second = null, third = null, fourth = null) {
    const ret = this.copy();
    ret.multiply(input, second, third, fourth);
    return ret;
  }

  /*------MODOLUS -- ALTERS ORIGINAL------*/
  modolus(input = null, second = null, third = null, fourth = null) {
    if (input instanceof Vec4) {
      this.x %= input.x;
      this.y %= input.y;
      this.z %= input.z;
      this.w %= input.w;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x %= input;
      this.y %= input;
      this.z %= input;
      this.w %= input;
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number' && typeof fourth === 'number') {
      this.x %= input;
      this.y %= second;
      this.z %= third;
      this.w %= fourth;
    }
    else {
      this.log('VECTOR MODOLUS -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------MODOLUS -- NOES NOT ALTER ORIGINAL------*/
  remainder(input = null, second = null, third = null, fourth = null) {
    const ret = this.copy();
    ret.modolus(input, second, third, fourth);
    return ret;
  }

  /*------CALCULATE DISTANCE------*/
  distance(input = null, second = null, third = null, fourth = null) {
    if (input instanceof Vec4) {
      const dx = input.x - this.x;
      const dy = input.y - this.y;
      const dz = input.z - this.z;
      const dw = input.w - this.w;
      return Vec4._distance(dx, dy, dz, dw);
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      const dx = input - this.x;
      const dy = input - this.y;
      const dz = input - this.z;
      const dw = input - this.w;
      return Vec4._distance(dx, dy, dz, dw);
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number' && typeof fourth === 'number') {
      const dx = input - this.x;
      const dy = second - this.y;
      const dz = third - this.z;
      const dw = fourth - this.w;
      return Vec4._distance(dx, dy, dz, dw);
    }
    this.log('INVALID INPUT', 'WARN');
    return null;
  }

  /*-------NORMALIZE TO RANGE -1 <=> 1 ------*/
  normalize() {
    let length = this._length;
    if (Math.abs(length) < 0.0000001) {
      return;
    }
    let percent = 1 / length;
    this.x *= percent;
    this.y *= percent;
    this.z *= percent;
    this.w *= percent;
  }

  get _length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  /*-------APPLY THE PERSPECTIVE COMPONENT TO NORMALIZE INTO VEC3------*/
  toVec3() {
    if (this.w !== 0) {
      this.x /= this.w;
      this.y /= this.w;
      this.z /= this.w;
      this.w = 1;
    }
    return new Vec3(this.x, this.y, this.z);
  };

  static _distance(dx, dy, dz, dw) {
    return Math.pow(Math.pow(dz, 2) + Math.pow(Math.pow(Math.pow(dx, 2) + Math.pow(dy, 2), 0.5), 2), 0.5) * dw;
  }
}