"use strict";

/*----------- 2D RECTANGLE CLASS-----------*/
class Rectangle extends Interface {
    constructor(pos = new Vec2(), size = new Vec2(), id) {
        super(id);
        this.position = pos;
        this.size = size;
    }

    /*-----------SAFE COPY-----------*/
    copy() {
        return new Rectangle(this.position.copy(), this.size.copy());
    }

    /*-----------POINT INTERSECTION-----------*/
    contains(positionVector) {
        if ((positionVector.x > this.position.x && positionVector.x < (this.position.x + this.size.x)) && (positionVector.y > this.position.y && positionVector.y < (this.position.y + this.size.y))) {
            return true;
        }
        else {
            return false;
        }
    }

    /*-----------COLLISION DETECTION WITH CIRCLE OR RECTANGLE-----------*/
    intersectsWith(shape) {
        if (shape instanceof Rectangle) {
            if (this.position.x < shape.position.x + shape.size.x &&
                this.position.x + this.size.x > shape.position.x &&
                this.position.y < shape.position.y + shape.size.y &&
                this.position.y + this.size.y > shape.position.y) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (shape instanceof Circle) {
            const closestPoint = new Vec2();
            closestPoint.x = Utilities.clamp(shape.position.x, this.position.x, this.size.x);
            closestPoint.y = Utilities.clamp(shape.position.y, this.position.y, this.size.y);
            const distance = closestPoint.distance(shape.position);
            if (distance < shape.radius) {
                return true;
            }
            else {
                return false;
            }
        }
    }

    /*-----------FOR USE WITH PER PIXEL COLLISION DETECTION-----------*/
    calculateIntersectionDepth(rectangle) {
        let minDistance = this.size.copy();
        minDistance.plus(rectangle.size).dividedBy(2);
        let distance = this.center.minus(rectangle.center);
        let depth = new Vec2();
        if (distance.x > 0) {
            depth.x = minDistance.x - distance.x;
        }
        else {
            depth.x = -minDistance.x - distance.x;
        }
        if (distance.y > 0) {
            depth.y = minDistance.y - distance.y;
        }
        else {
            depth.y = -minDistance.y - distance.y;
        }
        return depth;
    }

    intersection(rect) {
        let depth = this.calculateIntersectionDepth(rect);
        let xMin = Math.max(this.position.x, rect.position.x);
        let xMax = Math.min(this.size.x, rect.size.x);
        let yMin = Math.max(this.position.y, rect.position.y);
        let yMax = Math.min(this.size.y, rect.size.y);
        return new Rectangle(new Vec2(xMin, yMin), new Vec2(Math.abs(depth.x), Math.abs(depth.y)));
    }

    scale(factor = new Vec2(1, 1)) {
        this.position.multiply(factor);
        this.size.multiply(factor);
    }

    get center() {
        let center = this.position.copy();
        center.add(this.size.dividedBy(2));
        return center;
    }
}