'use strict';

/*------GENERIC CAMERA CLASS -- incomplete ------*/
class Camera extends Interface {
  constructor(type, id = 'ANON-CAMERA') {
    super(id);
    this.type = type || 'TRACKING';
    if (this.type !== 'ORBITING' && this.type !== 'TRACKING') {
      this.log('CAMERA MUST BE OF TYPE --ORBITING-- or --TRACKING--!', 'ERROR');
    }
    this.matrix = new Matrix();
    this.position = new Vec3();
    this.velocity = new Vec3();
    this.rotations = new Vec3();
    this.rotationMatrix = new Matrix();
    this.normal = new Vec3();
    this.up = new Vec3();
    this.right = new Vec3();
    this.orientation = new Vec3();
  }

  /*------UPDATE MATRIX DATA------*/
  update() {
    this.position.add(this.velocity);
    this.matrix = new Matrix();
    if (this.type === 'TRACKING') {
      this.matrix.translate(this.position.x, this.position.y, this.position.z);
      this.updateRotation();
    }
    else {
      this.updateRotation();
      this.matrix.translate(this.position.x, this.position.y, this.position.z);
    }
    this.updateNormals();
  }

  /*------CALCULATE RELATIVE ROTATIONS -- incomplete ------*/
  updateRotation() {
    this.rotationMatrix.rotate(this.rotations.y, 0, 1, 0);
    this.rotationMatrix.rotate(this.rotations.x, 1, 0, 0);
    this.rotationMatrix.rotate(this.rotations.z, 0, 0, 1);
    if (this.root.godMode) {
      this.rotations = new Vec3();
    }
    const m = this.matrix.mat4;
    const r = this.rotationMatrix.mat4;
    m[0] = r[0]; m[1] = r[1]; m[2] = r[2];
    m[4] = r[4]; m[5] = r[5]; m[6] = r[6];
    m[8] = r[8]; m[9] = r[9]; m[10] = r[10];
    this.orientation = this.rotationMatrix.toEuler();
  }

  /*------UPDATE DIRECTION VECTORS------*/
  updateNormals() {
    const mat = this.viewTransform;
    this.normal = new Vec3(
      mat.mat4[2],
      mat.mat4[6],
      mat.mat4[10]
    );
    this.up = new Vec3(
      mat.mat4[1],
      mat.mat4[5],
      mat.mat4[9]
    );
    this.right = new Vec3(
      mat.mat4[0],
      mat.mat4[4],
      mat.mat4[8]
    );
  }

  /*------ORIENT CAMERA TO DESIRED COORDINATES -- untested ------*/
  lookAt(pos) {
    if (!(pos instanceof Vec3)) {
      this.log('CAMERA LOOK AT -- INVALID INPUT', 'WARN');
      return;
    }
    let
      tx = -Vector.dotProduct(this.up, pos),
      ty = -Vector.dotProduct(this.right, pos),
      tz = -Vector.dotProduct(this.normal, pos);
    this.rotationMatrix.mat4[0] = this.up.x; this.rotationMatrix.mat4[4] = this.up.y; this.rotationMatrix.mat4[8] = this.up.z; this.rotationMatrix.mat4[12] = tx;
    this.rotationMatrix.mat4[1] = this.right.x; this.rotationMatrix.mat4[5] = this.right.y; this.rotationMatrix.mat4[9] = this.right.z; this.rotationMatrix.mat4[13] = ty;
    this.rotationMatrix.mat4[2] = this.normal.x; this.rotationMatrix.mat4[6] = this.normal.y; this.rotationMatrix.mat4[10] = this.normal.z; this.rotationMatrix.mat4[14] = tz;
    this.rotationMatrix.mat4[3] = 0; this.rotationMatrix.mat4[7] = 0; this.rotationMatrix.mat4[11] = 0; this.rotationMatrix.mat4[15] = 1;
  }

  /*------PROVIDE INVERSE MATRIX------*/
  get viewTransform() {
    let matrix = this.matrix.copy();
    matrix.invert();
    return matrix;
  }
}