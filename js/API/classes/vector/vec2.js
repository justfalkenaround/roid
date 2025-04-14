'use strict';

/*------TWO DIMENSIONAL VECTOR------*/
class Vec2 extends Vector {
  constructor(x = 0, y = 0, id = 'ANON-VEC2') {
    super(id);
    this.x = x;
    this.y = y;
    this.dimensions = 2;
  }

  /*------GET BASIC ARRAY VERSION------*/
  get array() {
    return [this.x, this.y];
  }

  /*------RETURN COPY------*/
  copy() {
    return new Vec2(this.x, this.y);
  }

  /*------COMPARISON OF EQUAL TYPE------*/
  equals(input = null) {
    if (!(input instanceof Vec2)) {
      this.log('CANNOT COMPARE VEC(n) AGAINST OTHER TYPE', 'WARN');
      return false;
    }
    return (this.x === input.x && this.y === input.y);
  }

  /*------SET VALUES TO ZERO------*/
  zero() {
    this.x = 0;
    this.y = 0;
  }

  /*------ADD -- ALTERS ORIGINAL------*/
  add(input = null, second = null) {
    if (input instanceof Vec2) {
      this.x += input.x;
      this.y += input.y;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x += input;
      this.y += input;
    }
    else if (typeof input === 'number' && typeof second === 'number') {
      this.x += input;
      this.y += second;
    }
    else {
      this.log('VECTOR ADDITION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------ADD -- DOES NOT ALTER ORIGINAL------*/
  plus(input = null, second = null) {
    const ret = this.copy();
    ret.add(input, second);
    return ret;
  }

  /*------SUBTRACT -- ALTERS ORIGINAL------*/
  subtract(input = null, second = null) {
    if (input instanceof Vec2) {
      this.x -= input.x;
      this.y -= input.y;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x -= input;
      this.y -= input;
    }
    else if (typeof input === 'number' && typeof second === 'number') {
      this.x -= input;
      this.y -= second;
    }
    else {
      this.log('VECTOR SUBTRACTION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------SUBTRACT -- DOES NOT ALTER ORIGINAL------*/
  minus(input = null, second = null) {
    const ret = this.copy();
    ret.subtract(input, second);
    return ret;
  }

  /*------DIVIDE -- ALTERS ORIGINAL------*/
  divide(input = null, second = null) {
    if (input instanceof Vec2) {
      this.x /= input.x;
      this.y /= input.y;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x /= input;
      this.y /= input;
    }
    else if (typeof input === 'number' && typeof second === 'number') {
      this.x /= input;
      this.y /= second;
    }
    else {
      this.log('VECTOR DIVISION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------DIVIDE -- NOES NOT ALTER ORIGINAL------*/
  dividedBy(input = null, second = null) {
    const ret = this.copy();
    ret.divide(input, second);
    return ret;
  }

  /*------MULTIPLY -- ALTERS ORIGINAL------*/
  multiply(input = null, second = null) {
    if (input instanceof Vec2) {
      this.x *= input.x;
      this.y *= input.y;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x *= input;
      this.y *= input;
    }
    else if (typeof input === 'number' && typeof second === 'number') {
      this.x *= input;
      this.y *= second;
    }
    else {
      this.log('VECTOR MULTIPLICATION -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------MULTIPLY -- NOES NOT ALTER ORIGINAL------*/
  times(input = null, second = null) {
    const ret = this.copy();
    ret.multiply(input, second);
    return ret;
  }

  /*------MODOLUS -- ALTERS ORIGINAL------*/
  modolus(input = null, second = null) {
    if (input instanceof Vec2) {
      this.x %= input.x;
      this.y %= input.y;
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      this.x %= input;
      this.y %= input;
    }
    else if (typeof input === 'number' && typeof second === 'number') {
      this.x %= input;
      this.y %= second;
    }
    else {
      this.log('VECTOR MODOLUS -- MUST BE OF TYPE VEC(n) OR NUMBER(\'s)', 'WARN');
    }
    return this;
  }

  /*------MODOLUS -- NOES NOT ALTER ORIGINAL------*/
  remainder(input = null, second = null) {
    const ret = this.copy();
    ret.modolus(input, second);
    return ret;
  }

  /*------CALCULATE DISTANCE------*/
  distance(input = null, second = null) {
    if (input instanceof Vec2) {
      const dx = input.x - this.x;
      const dy = input.y - this.y;
      return Vec2._distance(dx, dy);
    }
    else if (typeof input === 'number' && typeof second !== 'number') {
      const dx = input - this.x;
      const dy = input - this.y;
      return Vec2._distance(dx, dy);
    }
    else if (typeof input === 'number' && typeof second === 'number') {
      const dx = input - this.x;
      const dy = second - this.y;
      return Vec2._distance(dx, dy);
    }
    this.log('INVALID INPUT', 'WARN');
    return null;
  }

  /*-------1 <=> 1------*/
  normalize() {
    let length = this._length;
    if (Math.abs(length) < 0.0000001) {
      return;
    }
    let percent = 1 / length;
    this.x *= percent;
    this.y *= percent;
  }

  get _length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  static _distance(dx, dy) {
    return Math.pow(Math.pow(dx, 2) + Math.pow(dy, 2), 0.5);
  }
}