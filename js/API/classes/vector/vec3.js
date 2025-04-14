'use strict';

/*------THREE DIMENSIONAL VECTOR------*/
class Vec3 extends Vector {
  constructor(x = 0, y = 0, z = 0, id = 'ANON-VEC3') {
    super(id);
    this.x = x;
    this.y = y;
    this.z = z;
    this.dimensions = 3;
  }

  /*------GET BASIC ARRAY VERSION------*/
  get array() {
    return [this.x, this.y, this.z];
  }

  /*------RETURN COPY------*/
  copy(id) {
    return new Vec3(this.x, this.y, this.z, id);
  }

  /*------COMPARISON OF EQUAL TYPE------*/
  equals(input = null) {
    if (!(input instanceof Vec3)) {
      this.log('CANNOT COMPARE VEC(n) AGAINST OTHER TYPE', 'WARN');
      return false;
    }
    return (this.x === input.x && this.y === input.y && input.z === this.z);
  }

  /*------SET VALUES TO ZERO------*/
  zero() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  /*------ADD -- ALTERS ORIGINAL------*/
  add(input = null, second = null, third = null) {
    if (input instanceof Vec3) {
      this.x += input.x;
      this.y += input.y;
      this.z += input.z;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x += input;
      this.y += input;
      this.z += input;
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number') {
      this.x += input;
      this.y += second;
      this.z += third;
    }
    else {
      this.log('VECTOR ADDITION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------ADD -- DOES NOT ALTER ORIGINAL------*/
  plus(input = null, second = null, third = null) {
    const ret = this.copy();
    ret.add(input, second, third);
    return ret;
  }

  /*------SUBTRACT -- ALTERS ORIGINAL------*/
  subtract(input = null, second = null, third = null) {
    if (input instanceof Vec3) {
      this.x -= input.x;
      this.y -= input.y;
      this.z -= input.z;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x -= input;
      this.y -= input;
      this.z -= input;
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number') {
      this.x -= input;
      this.y -= second;
      this.z -= third;
    }
    else {
      this.log('VECTOR SUBTRACTION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------SUBTRACT -- DOES NOT ALTER ORIGINAL------*/
  minus(input = null, second = null, third = null) {
    const ret = this.copy();
    ret.subtract(input, second, third);
    return ret;
  }

  /*------DIVIDE -- ALTERS ORIGINAL------*/
  divide(input = null, second = null, third = null) {
    if (input instanceof Vec3) {
      this.x /= input.x;
      this.y /= input.y;
      this.z /= input.z;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x /= input;
      this.y /= input;
      this.z /= input;
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number') {
      this.x /= input;
      this.y /= second;
      this.z /= third;
    }
    else {
      this.log('VECTOR DIVISION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------DIVIDE -- NOES NOT ALTER ORIGINAL------*/
  dividedBy(input = null, second = null, third = null) {
    const ret = this.copy();
    ret.divide(input, second, third);
    return ret;
  }

  /*------MULTIPLY -- ALTERS ORIGINAL------*/
  multiply(input = null, second = null, third = null) {
    if (input instanceof Vec3) {
      this.x *= input.x;
      this.y *= input.y;
      this.z *= input.z;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x *= input;
      this.y *= input;
      this.z *= input;
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number') {
      this.x *= input;
      this.y *= second;
      this.z *= third;
    }
    else {
      this.log('VECTOR MULTIPLICATION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------MULTIPLY -- NOES NOT ALTER ORIGINAL------*/
  times(input = null, second = null, third = null) {
    const ret = this.copy();
    ret.multiply(input, second, third);
    return ret;
  }

  /*------MODOLUS -- ALTERS ORIGINAL------*/
  modolus(input = null, second = null, third = null) {
    if (input instanceof Vec3) {
      this.x %= input.x;
      this.y %= input.y;
      this.z %= input.z;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x %= input;
      this.y %= input;
      this.z %= input;
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number') {
      this.x %= input;
      this.y %= second;
      this.z %= third;
    }
    else {
      this.log('VECTOR MODOLUS -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------MODOLUS -- NOES NOT ALTER ORIGINAL------*/
  remainder(input = null, second = null, third = null) {
    const ret = this.copy();
    ret.modulus(input, second, third);
    return ret;
  }

  /*------CALCULATE DISTANCE------*/
  distance(input = null, second = null, third = null) {
    if (input instanceof Vec3) {
      const dx = input.x - this.x;
      const dy = input.y - this.y;
      const dz = input.z - this.z;
      return Vec3._distance(dx, dy, dz);
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      const dx = input - this.x;
      const dy = input - this.y;
      const dz = input - this.z;
      return Vec3._distance(dx, dy, dz);
    }
    else if (typeof input === 'number' && typeof second === 'number' && typeof third === 'number') {
      const dx = input - this.x;
      const dy = second - this.y;
      const dz = third - this.z;
      return Vec3._distance(dx, dy, dz);
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
  }

  /*-------QUATERNION FORM ARRAY FOR ROTATIONS------*/
  get quaternion() {
    let quat = [null, null, null, null];
    const t0 = Math.cos(this.x * 0.5);
    const t1 = Math.sin(this.x * 0.5);
    const t2 = Math.cos(this.y * 0.5);
    const t3 = Math.sin(this.y * 0.5);
    const t4 = Math.cos(this.z * 0.5);
    const t5 = Math.sin(this.z * 0.5);
    quat[0] = t0 * t2 * t4 + t1 * t3 * t5;
    quat[1] = t0 * t3 * t4 - t1 * t2 * t5;
    quat[2] = t0 * t2 * t5 + t1 * t3 * t4;
    quat[3] = t1 * t2 * t4 - t0 * t3 * t5;
    return quat;
  }

  get _length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  static _distance(dx, dy, dz) {
    return Math.pow(Math.pow(dz, 2) + Math.pow(Math.pow(Math.pow(dx, 2) + Math.pow(dy, 2), 0.5), 2), 0.5);
  }
}