"use strict";

/*-----------2D CIRCLE CLASS-----------*/
class Circle extends Interface {
  constructor(pos = new Vec2(), radius = 1, id) {
    super(id);
    this.position = pos;
    this.radius = radius;
  }

  /*-----------POINT INTERSECTION-----------*/
  contains(pos) {
    const distance = this.position.distance(pos);
    if (distance <= this.radius) {
      return true;
    }
    else {
      return false;
    }
  }

  /*-----------COLLISION DETECTION WITH CIRCLE OR RECTANGLE-----------*/
  intersectsWith(shape) {
    if (shape instanceof Circle) {
      const distance = this.position.distance(shape.position);
      if (distance < this.radius + shape.radius) {
        return true;
      }
      else {
        return false;
      }
    }
    else if (shape instanceof Rectangle) {
      const closestPoint = new Vec2();
      closestPoint.x = Utilities.clamp(this.position.x, shape.position.x, shape.size.x);
      closestPoint.y = Utilities.clamp(this.position.y, shape.position.y, shape.size.y);
      const distance = closestPoint.distance(shape.position);
      if (distance < this.radius) {
        return true;
      }
      else {
        return false;
      }
    }
  }
}