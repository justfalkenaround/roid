'use strict';

/*------GENERIC GEOMETRY CLASS------*/
class Geometry extends Interface {
  constructor(data, id) {
    if (!id && typeof data.descriptor !== 'undefined') {
      id = 'ANON-';
      id += data.descriptor || 'GEOMETRY';
    }
    else if (!id) {
      id = 'ANON-GEOMETRY';
    }
    super(id);
    if (data.position) {
      this.position = new Vec3(data.position[0], data.position[1], data.position[2]);
    }
    else {
      this.position = new Vec3();
    }
    if (data.velocity) {
      this.velocity = new Vec3(data.velocity[0], data.velocity[1], data.velocity[2]);
    }
    else {
      this.velocity = new Vec3();
    }
    if (data.rotation) {
      this.rotation = new Vec3(data.rotation[0], data.rotation[1], data.rotation[2]);
    }
    else {
      this.rotation = new Vec3();
    }
    if (data.rotationVelocity) {
      this.rotationVelocity = new Vec3(data.rotationVelocity[0], data.rotationVelocity[1], data.rotationVelocity[2]);
    }
    else {
      this.rotationVelocity = new Vec3();
    }
    if (data.scale) {
      this.scale = new Vec3(data.scale[0], data.scale[1], data.scale[2]);;
    }
    else {
      this.scale = new Vec3(1, 1, 1);
    }
    this.bounding = false;
    this.visible = true;
    this.renderingMode = data.renderingMode || 'TRIANGLES';
    this.vertices = data.vertices;
    this.indices = data.indices;
    this.normals = [];
    this.uPhong = false;
    this.flatShading = data.flatShading || false;
    this.faces = 0;
    this.faceNormals = [];
    this.colors = data.colors || [];
    this.batchType = false;
    if (this.colors.length === 0) {
      if (data.color) {
        for (let i = 0, j = this.vertices.length; i < j; i++) {
          this.colors.push(data.color[0]);
          this.colors.push(data.color[1]);
          this.colors.push(data.color[2]);
          this.colors.push(data.color[3]);
        }
      }
      else {
        for (let i = 0, j = this.vertices.length * (4 / 3); i < j; i++) {
          this.colors.push(1);
        }
      }
    }
    if (data.color) {
      this.materialDiffuse = new Vec4(data.color[0], data.color[1], data.color[2], data.color[3]);
      this.materialAmbient = new Vec4(data.color[0], data.color[1], data.color[2], data.color[3]);
      this.materialSpecular = new Vec4(data.color[0], data.color[1], data.color[2], data.color[3]);
    }
    else {
      this.materialDiffuse = new Vec4(1, 1, 1, 1);
      this.materialAmbient = new Vec4(1, 1, 1, 1);
      this.materialSpecular = new Vec4(1, 1, 1, 1);
    }
    this.shininess = data.shininess || 10;
  }

  /*------INITIALIZE GEOMETRY BEFORE RENDERING------*/
  initialize() {
    this.local_root = this.root;
    if (this.renderingMode === 'TRIANGLES') {
      this.renderingMode = this.gl.TRIANGLES;
      this.faces = this.indices.length / 3;
      this.uPhong = true;
    }
    else if (this.renderingMode === 'LINES') {
      this.renderingMode = this.gl.LINES;
      this.uPhong = false;
    }
    else if (this.renderingMode === 'POINTS') {
      this.renderingMode = this.gl.POINTS;
      this.uPhong = false;
    }
    else if (this.renderingMode === 'LINE_LOOP') {
      this.renderingMode = this.gl.LINE_LOOP;
      this.uPhong = false;
    }
    else if (this.renderingMode === 'LINE_STRIP') {
      this.renderingMode = this.gl.LINE_STRIP;
      this.uPhong = false;
    }
    else if (this.renderingMode === 'TRIANGLE_STRIP') {
      this.renderingMode = this.gl.TRIANGLE_STRIP;
      this.faces = this.indices.length - 2;
      this.uPhong = true;
    }
    else if (this.renderingMode === 'TRIANGLE_FAN') {
      this.renderingMode = this.gl.TRIANGLE_FAN;
      this.faces = (this.indices.length - 1) / 2;
      this.uPhong = true;
    }
    if (this.local_root.skeletonMode && (this.renderingMode === this.gl.TRIANGLES || this.renderingMode === this.gl.TRIANGLE_FAN || this.renderingMode === this.gl.TRIANGLE_STRIP)) {
      this.renderingMode = this.gl.LINES;
      this.uPhong = false;
    }
    if (!this.flatShading) {
      this.generateNormals();
    }
    else {
      this.generateFaceNormals();
      this.normals = this.faceNormals;
    }
    this.previousRenderingMode = this.renderingMode;
    this.previousUPhong = this.uPhong;
    this.VAO = this.gl.createVertexArray();
    this.gl.bindVertexArray(this.VAO);
    this.vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.local_root.program.program.aVertexPosition);
    this.gl.vertexAttribPointer(this.local_root.program.program.aVertexPosition, 3, this.gl.FLOAT, false, 0, 0);
    this.normalsBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalsBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.normals), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.local_root.program.program.aVertexNormal);
    this.gl.vertexAttribPointer(this.local_root.program.program.aVertexNormal, 3, this.gl.FLOAT, false, 0, 0);
    this.colorBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.colors), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.local_root.program.program.vVertexColor);
    this.gl.vertexAttribPointer(this.local_root.program.program.vVertexColor, 4, this.gl.FLOAT, false, 0, 0);
    this.indexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
    this.unbind();
  }

  /*------UPDATE RELATIVE TO WORLD/PARENTS ------*/
  update() {
    if (!this.bounding) {
      this.rotation.modolus(Math.PI * 2);
      this.rotation.add(this.relativeRotationVelocity);
    }
    this.position.add(this.relativeVelocity);
  }

  /*------MANAGE STATE AND RENDER SELF------*/
  render() {
    if (!this.visible) {
      return;
    }
    const temporaryMatrix = this.local_root.modelViewMatrix.copy();
    this.local_root.modelViewMatrix.translate(this.relativePosition.x, this.relativePosition.y, this.relativePosition.z);
    if (!this.bounding) {
      this.local_root.modelViewMatrix.rotate(this.relativeRotation.y, 0, 1, 0);
      this.local_root.modelViewMatrix.rotate(this.relativeRotation.x, 1, 0, 0);
      this.local_root.modelViewMatrix.rotate(this.relativeRotation.z, 0, 0, 1);
    }
    this.local_root.modelViewMatrix.scale(this.relativeScale.x, this.relativeScale.y, this.relativeScale.z);
    this.local_root.updateMatrix();
    this.updateUniforms();
    this.gl.bindVertexArray(this.VAO);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    this.gl.drawElements(this.renderingMode, this.indices.length, this.gl.UNSIGNED_SHORT, 0);
    this.local_root.modelViewMatrix = temporaryMatrix;
    this.unbind();
    super.render();
  }

  /*------UPDATE GPU DATA------*/
  updateUniforms() {
    this.gl.uniform1i(this.local_root.program.program.uPhong, this.uPhong);
    this.gl.uniform4fv(this.local_root.program.program.uMaterialDiffuse, this.materialDiffuse.array);
    this.gl.uniform4fv(this.local_root.program.program.uMaterialAmbient, this.materialAmbient.array);
    this.gl.uniform4fv(this.local_root.program.program.uMaterialSpecular, this.materialSpecular.array);
    this.gl.uniform1f(this.local_root.program.program.uShininess, this.shininess);
  }

  /*------HANDLE USER INPUT------*/
  handleInput() {
    if (this.local_root.keyboard.keyStates[77].pressed) {
      if (this.local_root.skeletonMode && (this.renderingMode === this.gl.TRIANGLES || this.renderingMode === this.gl.TRIANGLE_FAN || this.renderingMode === this.gl.TRIANGLE_STRIP)) {
        this.previousRenderingMode = this.renderingMode;
        this.previousUPhong = this.uPhong;
        this.renderingMode = this.gl.LINES;
        this.uPhong = false;
      }
      else {
        this.renderingMode = this.previousRenderingMode;
        this.uPhong = this.previousUPhong;
      }
    }
  }

  /*------CLEAN GPU MEMORY------*/
  unbind() {
    this.gl.bindVertexArray(null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
  }

  /*------POPULATE COLOR PROPERTIES WITH SINGLE RGBA VALUE------*/
  set color(val) {
    this._color = val;
    this.colors = [];
    for (let i = 0, j = this.vertices.length; i < j; i++) {
      this.colors.push(val[0]);
      this.colors.push(val[1]);
      this.colors.push(val[2]);
      this.colors.push(val[3]);
    }
    this.materialDiffuse = new Vec4(val[0], val[1], val[2], val[3]);
    this.materialAmbient = new Vec4(val[0], val[1], val[2], val[3]);
    this.materialSpecular = new Vec4(val[0], val[1], val[2], val[3]);
  }

  get color() {
    return this._color;
  }

  /*------GETTERS FOR PROPERTIES RELATIVE TO ANCESTORS------*/
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

  /*------GENERATE NORMALS FOR FLAT SHADING------*/
  generateFaceNormals() {
    const
      x = 0,
      y = 1,
      z = 2,
      nms = [];
    for (let i = 0; i < this.vertices.length; i += 3) {
      nms[i + x] = 0.0;
      nms[i + y] = 0.0;
      nms[i + z] = 0.0;
    }
    for (let i = 0; i < this.indices.length; i += 3) {
      const v1 = [], v2 = [], normal = [];
      v1[x] = this.vertices[3 * this.indices[i + 2] + x] - this.vertices[3 * this.indices[i + 1] + x];
      v1[y] = this.vertices[3 * this.indices[i + 2] + y] - this.vertices[3 * this.indices[i + 1] + y];
      v1[z] = this.vertices[3 * this.indices[i + 2] + z] - this.vertices[3 * this.indices[i + 1] + z];
      v2[x] = this.vertices[3 * this.indices[i] + x] - this.vertices[3 * this.indices[i + 1] + x];
      v2[y] = this.vertices[3 * this.indices[i] + y] - this.vertices[3 * this.indices[i + 1] + y];
      v2[z] = this.vertices[3 * this.indices[i] + z] - this.vertices[3 * this.indices[i + 1] + z];
      normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
      normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
      normal[z] = v1[x] * v2[y] - v1[y] * v2[x];
      for (let j = 0; j < 3; j++) {
        nms[3 * this.indices[i + j] + x] = nms[3 * this.indices[i + j] + x] + normal[x];
        nms[3 * this.indices[i + j] + y] = nms[3 * this.indices[i + j] + y] + normal[y];
        nms[3 * this.indices[i + j] + z] = nms[3 * this.indices[i + j] + z] + normal[z];
      }
    }
    for (let i = 0; i < this.vertices.length; i += 3) {
      const nn = [];
      nn[x] = nms[i + x];
      nn[y] = nms[i + y];
      nn[z] = nms[i + z];
      let len = Math.sqrt((nn[x] * nn[x]) + (nn[y] * nn[y]) + (nn[z] * nn[z]));
      if (len === 0) len = 1.0;
      nn[x] = nn[x] / len;
      nn[y] = nn[y] / len;
      nn[z] = nn[z] / len;
      nms[i + x] = nn[x];
      nms[i + y] = nn[y];
      nms[i + z] = nn[z];
    }
    return this.faceNormals = nms;
  }

  /*------ADDITIONAL NORMAL CALCULATOR------*/
  static _calculateFlatNormal(cd1, cd2, cd3) {
    let va = new Array(3), vb = new Array(3), vr = new Array(3), val;
    va[0] = cd1[0] - cd2[0];
    va[1] = cd1[1] - cd2[1];
    va[2] = cd1[2] - cd2[2];

    vb[0] = cd1[0] - cd3[0];
    vb[1] = cd1[1] - cd3[1];
    vb[2] = cd1[2] - cd3[2];

    vr[0] = va[1] * vb[2] - vb[1] * va[2];
    vr[1] = vb[0] * va[2] - va[0] * vb[2];
    vr[2] = va[0] * vb[1] - vb[0] * va[1];

    val = Math.sqrt(vr[0] * vr[0] + vr[1] * vr[1] + vr[2] * vr[2]);

    let norm = new Array(3);
    norm[0] = vr[0] / val;
    norm[1] = vr[1] / val;
    norm[2] = vr[2] / val;
    return norm;
  }

  /*------GENERATE ADDITIVE VECTOR NORMALS BASED ON INDICES/RENDERING MODE------*/
  generateNormals() {
    if (this.renderingMode === this.gl.TRIANGLES || this.renderingMode === this.gl.LINES || this.renderingMode === this.gl.LINE_LOOP ||
      this.renderingMode === this.gl.LINE_STRIP || this.renderingMode === this.gl.POINTS) {
      let tempNorms = new Array(this.vertices.length / 3);
      for (let i = 0, j = tempNorms.length; i < j; i++) {
        tempNorms[i] = null;
      }
      for (let i = 0, j = this.indices.length; i < j; i += 3) {
        let x0 = this.vertices[this.indices[i] * 3];
        let y0 = this.vertices[this.indices[i] * 3 + 1];
        let z0 = this.vertices[this.indices[i] * 3 + 2];
        let p0 = new Vec3(x0, y0, z0);

        let x1 = this.vertices[this.indices[i + 1] * 3];
        let y1 = this.vertices[this.indices[i + 1] * 3 + 1];
        let z1 = this.vertices[this.indices[i + 1] * 3 + 2];
        let p1 = new Vec3(x1, y1, z1);

        let x2 = this.vertices[this.indices[i + 2] * 3];
        let y2 = this.vertices[this.indices[i + 2] * 3 + 1];
        let z2 = this.vertices[this.indices[i + 2] * 3 + 2];
        let p2 = new Vec3(x2, y2, z2);

        let v1 = p1.minus(p0);
        let v2 = p2.minus(p0);
        let n0 = Vector.crossProduct(v1, v2);

        v1 = p2.minus(p1);
        v2 = p0.minus(p1);
        let n1 = Vector.crossProduct(v1, v2);

        v1 = p0.minus(p2);
        v2 = p1.minus(p2);
        let n2 = Vector.crossProduct(v1, v2);

        if (!tempNorms[this.indices[i]]) {
          tempNorms[this.indices[i]] = n0;
        }
        else {
          tempNorms[this.indices[i]] = tempNorms[this.indices[i]].plus(n0);
        }
        if (!tempNorms[this.indices[i + 1]]) {
          tempNorms[this.indices[i + 1]] = n1;
        }
        else {
          tempNorms[this.indices[i + 1]] = tempNorms[this.indices[i + 1]].plus(n1);
        }
        if (!tempNorms[this.indices[i + 2]]) {
          tempNorms[this.indices[i + 2]] = n2;
        }
        else {
          tempNorms[this.indices[i + 2]] = tempNorms[this.indices[i + 2]].plus(n2);
        }
      }
      for (let i = 0, j = tempNorms.length; i < j; i++) {
        if (!tempNorms[i]) {
          continue;
        }
        tempNorms[i].normalize();
        this.normals.push(tempNorms[i].x);
        this.normals.push(tempNorms[i].y);
        this.normals.push(tempNorms[i].z);
      }
    }
    else if (this.renderingMode === this.gl.TRIANGLE_STRIP) {
      let tempNorms = new Array(this.vertices.length / 3);
      for (let i = 0, j = tempNorms.length; i < j; i++) {
        tempNorms[i] = null;
      }
      for (let i = 0, j = this.indices.length; i < j; i++) {
        let x0 = this.vertices[this.indices[i] * 3];
        let y0 = this.vertices[this.indices[i] * 3 + 1];
        let z0 = this.vertices[this.indices[i] * 3 + 2];
        let p0 = new Vec3(x0, y0, z0);

        let x1 = this.vertices[this.indices[i + 1] * 3];
        let y1 = this.vertices[this.indices[i + 1] * 3 + 1];
        let z1 = this.vertices[this.indices[i + 1] * 3 + 2];
        let p1 = new Vec3(x1, y1, z1);

        let x2 = this.vertices[this.indices[i + 2] * 3];
        let y2 = this.vertices[this.indices[i + 2] * 3 + 1];
        let z2 = this.vertices[this.indices[i + 2] * 3 + 2];
        let p2 = new Vec3(x2, y2, z2);

        let v1 = p1.minus(p0);
        let v2 = p2.minus(p0);
        let n0 = Vector.crossProduct(v1, v2);

        v1 = p2.minus(p1);
        v2 = p0.minus(p1);
        let n1 = Vector.crossProduct(v1, v2);

        v1 = p0.minus(p2);
        v2 = p1.minus(p2);
        let n2 = Vector.crossProduct(v1, v2);

        if (!tempNorms[this.indices[i]]) {
          tempNorms[this.indices[i]] = n0;
        }
        else {
          tempNorms[this.indices[i]] = tempNorms[this.indices[i]].plus(n0);
        }
        if (!tempNorms[this.indices[i + 1]]) {
          tempNorms[this.indices[i + 1]] = n1;
        }
        else {
          tempNorms[this.indices[i + 1]] = tempNorms[this.indices[i + 1]].plus(n1);
        }
        if (!tempNorms[this.indices[i + 2]]) {
          tempNorms[this.indices[i + 2]] = n2;
        }
        else {
          tempNorms[this.indices[i + 2]] = tempNorms[this.indices[i + 2]].plus(n2);
        }
      }
      for (let i = 0, j = tempNorms.length; i < j; i++) {
        tempNorms[i].normalize();
        this.normals.push(tempNorms[i].x);
        this.normals.push(tempNorms[i].y);
        this.normals.push(tempNorms[i].z);
      }
    }
    else if (this.renderingMode === this.gl.TRIANGLE_FAN) {
      let tempNorms = new Array(this.vertices.length / 3);
      for (let i = 1, j = tempNorms.length; i < j; i += 2) {
        tempNorms[i] = null;
      }
      for (let i = 0, j = this.indices.length; i < j; i++) {
        let x0 = this.vertices[this.indices[0] * 3];
        let y0 = this.vertices[this.indices[0] * 3 + 1];
        let z0 = this.vertices[this.indices[0] * 3 + 2];
        let p0 = new Vec3(x0, y0, z0);

        let x1 = this.vertices[this.indices[i] * 3];
        let y1 = this.vertices[this.indices[i] * 3 + 1];
        let z1 = this.vertices[this.indices[i] * 3 + 2];
        let p1 = new Vec3(x1, y1, z1);

        let x2 = this.vertices[this.indices[i + 1] * 3];
        let y2 = this.vertices[this.indices[i + 1] * 3 + 1];
        let z2 = this.vertices[this.indices[i + 1] * 3 + 2];
        let p2 = new Vec3(x2, y2, z2);

        let v1 = p1.minus(p0);
        let v2 = p2.minus(p0);
        let n0 = Vector.crossProduct(v1, v2);

        v1 = p2.minus(p1);
        v2 = p0.minus(p1);
        let n1 = Vector.crossProduct(v1, v2);

        v1 = p0.minus(p2);
        v2 = p1.minus(p2);
        let n2 = Vector.crossProduct(v1, v2);

        if (!tempNorms[this.indices[0]]) {
          tempNorms[this.indices[0]] = n0;
        }
        else {
          tempNorms[this.indices[0]] = tempNorms[this.indices[0]].plus(n0);
        }
        if (!tempNorms[this.indices[i]]) {
          tempNorms[this.indices[i]] = n1;
        }
        else {
          tempNorms[this.indices[i]] = tempNorms[this.indices[i]].plus(n1);
        }
        if (!tempNorms[this.indices[i + 1]]) {
          tempNorms[this.indices[i + 1]] = n2;
        }
        else {
          tempNorms[this.indices[i + 1]] = tempNorms[this.indices[i + 1]].plus(n2);
        }
      }
      for (let i = 0, j = tempNorms.length; i < j; i++) {
        tempNorms[i].normalize();
        this.normals.push(tempNorms[i].x);
        this.normals.push(tempNorms[i].y);
        this.normals.push(tempNorms[i].z);
      }
    }
    else {
      this.log('MUST USE A FORM OF TRIANGLE PRIMATIVE TO CALCULATE NORMALS.', 'WARN');
    }
  }

  /*------GENERATE TANGENTS -- REQUIRES TESTING ------*/
  static _calculateTangents(verts, texc, inds) {
    const tangents = [];
    for (let i = 0; i < verts.length / 3; i++) {
      tangents[i] = new Vec3(0, 0, 0);
    }
    let
      a = new Vec3(0, 0, 0),
      b = new Vec3(0, 0, 0),
      triTangent = new Vec3(0, 0, 0);
    for (let i = 0; i < inds.length; i += 3) {
      const i0 = inds[i];
      const i1 = inds[i + 1];
      const i2 = inds[i + 2];
      const pos0 = new Vec3(verts[i0 * 3], verts[i0 * 3 + 1], verts[i0 * 3 + 2]);
      const pos1 = new Vec3(verts[i1 * 3], verts[i1 * 3 + 1], verts[i1 * 3 + 2]);
      const pos2 = new Vec3(verts[i2 * 3], verts[i2 * 3 + 1], verts[i2 * 3 + 2]);
      const tex0 = [texc[i0 * 2], texc[i0 * 2 + 1]];
      const tex1 = [texc[i1 * 2], texc[i1 * 2 + 1]];
      const tex2 = [texc[i2 * 2], texc[i2 * 2 + 1]];
      pos1.subtract(pos0);
      pos2.subtract(pos2);
      const c2c1b = tex1[1] - tex0[1];
      const c3c1b = tex2[0] - tex0[1];
      triTangent = new Vec3(c3c1b * a[0] - c2c1b * b[0], c3c1b * a[1] - c2c1b * b[1], c3c1b * a[2] - c2c1b * b[2]);
      tangents[i0].add(triTangent);
      tangents[i1].add(triTangent);
      tangents[i2].add(triTangent);
    }
    const ts = [];
    tangents.forEach((tan) => {
      tan.normalize();
      ts.push(tan.x);
      ts.push(tan.y);
      ts.push(tan.z);
    });
    return ts;
  }

  /*------ALTERNATIVE ADDITIVE NORMAL CALCULATON ALGORITHM FOR TRIANGLE PRIMATIVE GEOMETRIES------*/
  static _calculateTriadicNormals(vs, ind) {
    const
      x = 0,
      y = 1,
      z = 2,
      nms = [];
    for (let i = 0; i < vs.length; i += 3) {
      nms[i + x] = 0.0;
      nms[i + y] = 0.0;
      nms[i + z] = 0.0;
    }
    for (let i = 0; i < ind.length; i += 3) {
      const v1 = [], v2 = [], normal = [];
      v1[x] = vs[3 * ind[i + 2] + x] - vs[3 * ind[i + 1] + x];
      v1[y] = vs[3 * ind[i + 2] + y] - vs[3 * ind[i + 1] + y];
      v1[z] = vs[3 * ind[i + 2] + z] - vs[3 * ind[i + 1] + z];
      v2[x] = vs[3 * ind[i] + x] - vs[3 * ind[i + 1] + x];
      v2[y] = vs[3 * ind[i] + y] - vs[3 * ind[i + 1] + y];
      v2[z] = vs[3 * ind[i] + z] - vs[3 * ind[i + 1] + z];
      normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
      normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
      normal[z] = v1[x] * v2[y] - v1[y] * v2[x];
      for (let j = 0; j < 3; j++) {
        nms[3 * ind[i + j] + x] = nms[3 * ind[i + j] + x] + normal[x];
        nms[3 * ind[i + j] + y] = nms[3 * ind[i + j] + y] + normal[y];
        nms[3 * ind[i + j] + z] = nms[3 * ind[i + j] + z] + normal[z];
      }
    }
    for (let i = 0; i < vs.length; i += 3) {
      const nn = [];
      nn[x] = nms[i + x];
      nn[y] = nms[i + y];
      nn[z] = nms[i + z];
      let len = Math.sqrt((nn[x] * nn[x]) + (nn[y] * nn[y]) + (nn[z] * nn[z]));
      if (len === 0) len = 1.0;
      nn[x] = nn[x] / len;
      nn[y] = nn[y] / len;
      nn[z] = nn[z] / len;
      nms[i + x] = nn[x];
      nms[i + y] = nn[y];
      nms[i + z] = nn[z];
    }
    return nms;
  }
}