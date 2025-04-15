'use strict';

/*------GENERIC MESH CLASS------*/
class Mesh extends ObjectList {
    constructor(position = new Vec3(), velocity = new Vec3(), rotation = new Vec3(), rotationVelocity = new Vec3(), scale = new Vec3(1, 1, 1), id = 'ANON-MESH') {
        super(id);
        this.position = position;
        this.velocity = velocity;
        this.rotation = rotation;
        this.rotationVelocity = rotationVelocity;
        this.scale = scale;
    }

    /*------GETTERS FOR RELATIVE PROPERTIES------*/
    get relativePosition() {
        if (!this.parent.relativePosition) {
            return this.position;
        }
        else {
            return this.position.plus(this.parent.relativePosition);
        }
    }

    get relativeVelocity() {
        if (!this.parent.relativeVelocity) {
            return this.velocity;
        }
        else {
            return this.velocity.plus(this.parent.relativeVelocity);
        }
    }

    get relativeRotation() {
        if (!this.parent.relativeRotation) {
            return this.rotation;
        }
        else {
            return this.rotation.plus(this.parent.relativeRotation);
        }
    }

    get relativeRotationVelocity() {
        if (!this.parent.relativeRotationVelocity) {
            return this.rotationVelocity;
        }
        else {
            return this.rotationVelocity.plus(this.parent.relativeRotationVelocity);
        }
    }

    get relativeScale() {
        if (!this.parent.relativeScale) {
            return this.scale;
        }
        else {
            return this.scale + this.parent.relativeScale;
        }
    }
}