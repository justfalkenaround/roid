'use strict';

/*------GENERIC FOUR DIMENSIONAL MATRIX CLASS -- ROW MAJOR ------*/
class Matrix extends Interface {
    constructor(mat4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], id = 'ANON-MATRIX') {
        super(id);
        this.mat4 = new Float32Array(mat4);
    }

    /*------SET TO THE IDENTITY MATRIX------*/
    identity() {
        this.mat4 = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    /*------PROVIDE A COPY------*/
    copy(a, b) {
        if (a && b instanceof Matrix) {
            a = b.copy();
            return a;
        }
        return new Matrix(this.mat4);
    }

    /*------MULTIPLY A 3D VECTOR------*/
    multiplyVec3(subject, m, v) {
        if (arguments.length > 1) {
            if (!(subject instanceof Vec3) || !(v instanceof Vec3) || !(m instanceof Matrix)) {
                Interface._log('MATRIX', 'MATRIX/VECTOR MULTIPLICATION INVALID INPUT', 'WARN');
                return;
            }
            subject[0] = m.mat4[0] * v.x + m.mat4[4] * v.y + m.mat4[8] * v.z;
            subject[1] = m.mat4[1] * v.x + m.mat4[5] * v.y + m.mat4[9] * v.z;
            subject[2] = m.mat4[2] * v.x + m.mat4[6] * v.y + m.mat4[10] * v.z;
        }
        else {
            if (!(subject instanceof Vec3)) {
                this.log('MATRIX/VECTOR MULTIPLICATION INVALID INPUT', 'WARN');
                return;
            }
            return new Vec3(
                this.mat4[0] * subject.x + this.mat4[4] * subject.y + this.mat4[8] * subject.z,
                this.mat4[1] * subject.x + this.mat4[5] * subject.y + this.mat4[9] * subject.z,
                this.mat4[2] * subject.x + this.mat4[6] * subject.y + this.mat4[10] * subject.z
            );
        }
    }

    /*------MULTIPLY A 4D VECTOR------*/
    multiplyVec4(subject, m, v) {
        if (arguments.length > 1) {
            if (!(subject instanceof Vec4) || !(v instanceof Vec4) || !(m instanceof Matrix)) {
                Interface._log('MATRIX', 'MATRIX/VECTOR MULTIPLICATION INVALID INPUT', 'WARN');
                return;
            }
            subject[0] = m.mat4[0] * v.x + m.mat4[4] * v.y + m.mat4[8] * v.z + m.mat4[12] * v.w;
            subject[1] = m.mat4[1] * v.x + m.mat4[5] * v.y + m.mat4[9] * v.z + m.mat4[13] * v.w;
            subject[2] = m.mat4[2] * v.x + m.mat4[6] * v.y + m.mat4[10] * v.z + m.mat4[14] * v.w;
            subject[3] = m.mat4[3] * v.x + m.mat4[7] * v.y + m.mat4[11] * v.z + m.mat4[15] * v.w;
        }
        else {
            if (!(subject instanceof Vec4)) {
                this.log('MATRIX/VECTOR MULTIPLICATION INVALID INPUT', 'WARN');
                return;
            }
            return new Vec4(
                this.mat4[0] * subject.x + this.mat4[4] * subject.y + this.mat4[8] * subject.z + this.mat4[12] * subject.w,
                this.mat4[1] * subject.x + this.mat4[5] * subject.y + this.mat4[9] * subject.z + this.mat4[13] * subject.w,
                this.mat4[2] * subject.x + this.mat4[6] * subject.y + this.mat4[10] * subject.z + this.mat4[14] * subject.w,
                this.mat4[3] * subject.x + this.mat4[7] * subject.y + this.mat4[11] * subject.z + this.mat4[15] * subject.w
            );
        }
    }

    /*------MULTIPLY BY ANOTHER MATRIX------*/
    multiply(subject, m1, m2) {
        if (arguments.length > 1) {
            if (!(subject instanceof Matrix) || !(m1 instanceof Matrix) || !(m2 instanceof Matrix)) {
                this.log('MATRIX MULTIPLICATION -- INVALID INPUT', 'WARN');
                return;
            }
            subject.mat4[0] = m1.mat4[0] * m2.mat4[0] + m1.mat4[4] * m2.mat4[1] + m1.mat4[8] * m2.mat4[2] + m1.mat4[12] * m2.mat4[3];
            subject.mat4[1] = m1.mat4[1] * m2.mat4[0] + m1.mat4[5] * m2.mat4[1] + m1.mat4[9] * m2.mat4[2] + m1.mat4[13] * m2.mat4[3];
            subject.mat4[2] = m1.mat4[2] * m2.mat4[0] + m1.mat4[6] * m2.mat4[1] + m1.mat4[10] * m2.mat4[2] + m1.mat4[14] * m2.mat4[3];
            subject.mat4[3] = m1.mat4[3] * m2.mat4[0] + m1.mat4[7] * m2.mat4[1] + m1.mat4[11] * m2.mat4[2] + m1.mat4[15] * m2.mat4[3];
            subject.mat4[4] = m1.mat4[0] * m2.mat4[4] + m1.mat4[4] * m2.mat4[5] + m1.mat4[8] * m2.mat4[6] + m1.mat4[12] * m2.mat4[7];
            subject.mat4[5] = m1.mat4[1] * m2.mat4[4] + m1.mat4[5] * m2.mat4[5] + m1.mat4[9] * m2.mat4[6] + m1.mat4[13] * m2.mat4[7];
            subject.mat4[6] = m1.mat4[2] * m2.mat4[4] + m1.mat4[6] * m2.mat4[5] + m1.mat4[10] * m2.mat4[6] + m1.mat4[14] * m2.mat4[7];
            subject.mat4[7] = m1.mat4[3] * m2.mat4[4] + m1.mat4[7] * m2.mat4[5] + m1.mat4[11] * m2.mat4[6] + m1.mat4[15] * m2.mat4[7];
            subject.mat4[8] = m1.mat4[0] * m2.mat4[8] + m1.mat4[4] * m2.mat4[9] + m1.mat4[8] * m2.mat4[10] + m1.mat4[12] * m2.mat4[11];
            subject.mat4[9] = m1.mat4[1] * m2.mat4[8] + m1.mat4[5] * m2.mat4[9] + m1.mat4[9] * m2.mat4[10] + m1.mat4[13] * m2.mat4[11];
            subject.mat4[10] = m1.mat4[2] * m2.mat4[8] + m1.mat4[6] * m2.mat4[9] + m1.mat4[10] * m2.mat4[10] + m1.mat4[14] * m2.mat4[11];
            subject.mat4[11] = m1.mat4[3] * m2.mat4[8] + m1.mat4[7] * m2.mat4[9] + m1.mat4[11] * m2.mat4[10] + m1.mat4[15] * m2.mat4[11];
            subject.mat4[12] = m1.mat4[0] * m2.mat4[12] + m1.mat4[4] * m2.mat4[13] + m1.mat4[8] * m2.mat4[14] + m1.mat4[12] * m2.mat4[15];
            subject.mat4[13] = m1.mat4[1] * m2.mat4[12] + m1.mat4[5] * m2.mat4[13] + m1.mat4[9] * m2.mat4[14] + m1.mat4[13] * m2.mat4[15];
            subject.mat4[14] = m1.mat4[2] * m2.mat4[12] + m1.mat4[6] * m2.mat4[13] + m1.mat4[10] * m2.mat4[14] + m1.mat4[14] * m2.mat4[15];
            subject.mat4[15] = m1.mat4[3] * m2.mat4[12] + m1.mat4[7] * m2.mat4[13] + m1.mat4[11] * m2.mat4[14] + m1.mat4[15] * m2.mat4[15];
        }
        else {
            if (!(subject instanceof Matrix)) {
                this.log('MATRIX MULTIPLICATION -- INVALID INPUT', 'WARN');
                return;
            }
            this.mat4[0] = this.mat4[0] * subject.mat4[0] + this.mat4[4] * subject.mat4[1] + this.mat4[8] * subject.mat4[2] + this.mat4[12] * subject.mat4[3];
            this.mat4[1] = this.mat4[1] * subject.mat4[0] + this.mat4[5] * subject.mat4[1] + this.mat4[9] * subject.mat4[2] + this.mat4[13] * subject.mat4[3];
            this.mat4[2] = this.mat4[2] * subject.mat4[0] + this.mat4[6] * subject.mat4[1] + this.mat4[10] * subject.mat4[2] + this.mat4[14] * subject.mat4[3];
            this.mat4[3] = this.mat4[3] * subject.mat4[0] + this.mat4[7] * subject.mat4[1] + this.mat4[11] * subject.mat4[2] + this.mat4[15] * subject.mat4[3];
            this.mat4[4] = this.mat4[0] * subject.mat4[4] + this.mat4[4] * subject.mat4[5] + this.mat4[8] * subject.mat4[6] + this.mat4[12] * subject.mat4[7];
            this.mat4[5] = this.mat4[1] * subject.mat4[4] + this.mat4[5] * subject.mat4[5] + this.mat4[9] * subject.mat4[6] + this.mat4[13] * subject.mat4[7];
            this.mat4[6] = this.mat4[2] * subject.mat4[4] + this.mat4[6] * subject.mat4[5] + this.mat4[10] * subject.mat4[6] + this.mat4[14] * subject.mat4[7];
            this.mat4[7] = this.mat4[3] * subject.mat4[4] + this.mat4[7] * subject.mat4[5] + this.mat4[11] * subject.mat4[6] + this.mat4[15] * subject.mat4[7];
            this.mat4[8] = this.mat4[0] * subject.mat4[8] + this.mat4[4] * subject.mat4[9] + this.mat4[8] * subject.mat4[10] + this.mat4[12] * subject.mat4[11];
            this.mat4[9] = this.mat4[1] * subject.mat4[8] + this.mat4[5] * subject.mat4[9] + this.mat4[9] * subject.mat4[10] + this.mat4[13] * subject.mat4[11];
            this.mat4[10] = this.mat4[2] * subject.mat4[8] + this.mat4[6] * subject.mat4[9] + this.mat4[10] * subject.mat4[10] + this.mat4[14] * subject.mat4[11];
            this.mat4[11] = this.mat4[3] * subject.mat4[8] + this.mat4[7] * subject.mat4[9] + this.mat4[11] * subject.mat4[10] + this.mat4[15] * subject.mat4[11];
            this.mat4[12] = this.mat4[0] * subject.mat4[12] + this.mat4[4] * subject.mat4[13] + this.mat4[8] * subject.mat4[14] + this.mat4[12] * subject.mat4[15];
            this.mat4[13] = this.mat4[1] * subject.mat4[12] + this.mat4[5] * subject.mat4[13] + this.mat4[9] * subject.mat4[14] + this.mat4[13] * subject.mat4[15];
            this.mat4[14] = this.mat4[2] * subject.mat4[12] + this.mat4[6] * subject.mat4[13] + this.mat4[10] * subject.mat4[14] + this.mat4[14] * subject.mat4[15];
            this.mat4[15] = this.mat4[3] * subject.mat4[12] + this.mat4[7] * subject.mat4[13] + this.mat4[11] * subject.mat4[14] + this.mat4[15] * subject.mat4[15];
        }
    }

    /*------MULTIPLY BY MULTIPLE MATRICES------*/
    multiplyMany() {
        if (arguments.length >= 3) {
            this.multiply(arguments[0], arguments[1], arguments[2]);
            for (let i = 3; i < arguments.length; i++) {
                this.multiply(arguments[0], arguments[0], arguments[i]);
            }
        }
        else {
            this.log('INVALID INPUT', 'WARN');
        }
    }

    /*------TRANSPOSE THE MATRIX------*/
    transpose() {
        let temp;
        temp = this.mat4[1]; this.mat4[1] = this.mat4[4]; this.mat4[4] = temp;
        temp = this.mat4[2]; this.mat4[2] = this.mat4[8]; this.mat4[8] = temp;
        temp = this.mat4[3]; this.mat4[3] = this.mat4[12]; this.mat4[12] = temp;
        temp = this.mat4[6]; this.mat4[6] = this.mat4[9]; this.mat4[9] = temp;
        temp = this.mat4[7]; this.mat4[7] = this.mat4[13]; this.mat4[13] = temp;
        temp = this.mat4[11]; this.mat4[11] = this.mat4[14]; this.mat4[14] = temp;
    }

    /*------INVERT THE MATRIX------*/
    invert(subject, m) {
        if (arguments.length === 0) {
            subject = this;
            m = this.copy();
        }
        else if (arguments.length === 1) {
            if (!(subject instanceof Matrix)) {
                this.log('MATRIX INVERSION -- INVALID INPUT', 'WARN');
                return;
            }
            m = this.copy();
        }
        else {
            if (!(subject instanceof Matrix) || !(m instanceof Matrix)) {
                this.log('MATRIX INVERSION -- INVALID INPUT', 'WARN');
                return;
            }
        }
        let
            d1 = m.mat4[9] * m.mat4[14] - m.mat4[13] * m.mat4[10],
            d2 = m.mat4[13] * m.mat4[6] - m.mat4[5] * m.mat4[14],
            d3 = m.mat4[5] * m.mat4[10] - m.mat4[9] * m.mat4[6],
            d4 = m.mat4[12] * m.mat4[10] - m.mat4[8] * m.mat4[14],
            d5 = m.mat4[4] * m.mat4[14] - m.mat4[12] * m.mat4[6],
            d6 = m.mat4[8] * m.mat4[6] - m.mat4[4] * m.mat4[10],
            d7 = m.mat4[8] * m.mat4[13] - m.mat4[12] * m.mat4[9],
            d8 = m.mat4[12] * m.mat4[5] - m.mat4[4] * m.mat4[13],
            d9 = m.mat4[4] * m.mat4[9] - m.mat4[8] * m.mat4[5],
            d10 = m.mat4[1] * m.mat4[14] - m.mat4[13] * m.mat4[2],
            d11 = m.mat4[9] * m.mat4[2] - m.mat4[1] * m.mat4[10],
            d12 = m.mat4[12] * m.mat4[2] - m.mat4[0] * m.mat4[14],
            d13 = m.mat4[0] * m.mat4[10] - m.mat4[8] * m.mat4[2],
            d14 = m.mat4[0] * m.mat4[13] - m.mat4[12] * m.mat4[1],
            d15 = m.mat4[8] * m.mat4[1] - m.mat4[0] * m.mat4[9],
            d16 = m.mat4[1] * m.mat4[6] - m.mat4[5] * m.mat4[2],
            d17 = m.mat4[4] * m.mat4[2] - m.mat4[0] * m.mat4[6],
            d18 = m.mat4[0] * m.mat4[5] - m.mat4[4] * m.mat4[1];
        subject.mat4[0] = m.mat4[7] * d1 + m.mat4[11] * d2 + m.mat4[15] * d3;
        subject.mat4[4] = m.mat4[7] * d4 + m.mat4[11] * d5 + m.mat4[15] * d6;
        subject.mat4[8] = m.mat4[7] * d7 + m.mat4[11] * d8 + m.mat4[15] * d9;
        subject.mat4[12] = m.mat4[6] * -d7 + m.mat4[10] * -d8 + m.mat4[14] * -d9;
        subject.mat4[1] = m.mat4[3] * -d1 + m.mat4[11] * d10 + m.mat4[15] * d11;
        subject.mat4[5] = m.mat4[3] * -d4 + m.mat4[11] * d12 + m.mat4[15] * d13;
        subject.mat4[9] = m.mat4[3] * -d7 + m.mat4[11] * d14 + m.mat4[15] * d15;
        subject.mat4[13] = m.mat4[2] * d7 + m.mat4[10] * -d14 + m.mat4[14] * -d15;
        subject.mat4[2] = m.mat4[3] * -d2 + m.mat4[7] * -d10 + m.mat4[15] * d16;
        subject.mat4[6] = m.mat4[3] * -d5 + m.mat4[7] * -d12 + m.mat4[15] * d17;
        subject.mat4[10] = m.mat4[3] * -d8 + m.mat4[7] * -d14 + m.mat4[15] * d18;
        subject.mat4[14] = m.mat4[2] * d8 + m.mat4[6] * d14 + m.mat4[14] * -d18;
        subject.mat4[3] = m.mat4[3] * -d3 + m.mat4[7] * -d11 + m.mat4[11] * -d16;
        subject.mat4[7] = m.mat4[3] * -d6 + m.mat4[7] * -d13 + m.mat4[11] * -d17;
        subject.mat4[11] = m.mat4[3] * -d9 + m.mat4[7] * -d15 + m.mat4[11] * -d18;
        subject.mat4[15] = m.mat4[2] * d9 + m.mat4[6] * d15 + m.mat4[10] * d18;
        let dt =
            m.mat4[3] * (m.mat4[6] * -d7 + m.mat4[10] * -d8 + m.mat4[14] * -d9) +
            m.mat4[7] * (m.mat4[2] * d7 + m.mat4[10] * -d14 + m.mat4[14] * -d15) +
            m.mat4[11] * (m.mat4[2] * d8 + m.mat4[6] * d14 + m.mat4[14] * -d18) +
            m.mat4[15] * (m.mat4[2] * d9 + m.mat4[6] * d15 + m.mat4[10] * d18);
        if (dt !== 0) {
            let scale = 1 / dt;
            for (let i = 0; i < 16; i++) {
                subject.mat4[i] = subject.mat4[i] * scale;
            }
        }
    }

    /*------SET ORTHOGRAPHIC PROJECTION MATRIX------*/
    orthographic(left, right, bottom, top, near, far) {
        if (left === right || bottom === top || near === far) {
            this.log('ORTHOGRAPHIC MATRIX -- INVALID INPUT', 'WARN');
            return;
        }
        let WR = 1.0 / (right - left);
        let HR = 1.0 / (top - bottom);
        let DR = 1.0 / (far - near);
        let sx = 2 * WR;
        let sy = 2 * HR;
        let sz = -2 * DR;
        let tx = -(right + left) * WR;
        let ty = -(top + bottom) * HR;
        let tz = -(far + near) * DR;
        this.mat4[0] = sx; this.mat4[4] = 0; this.mat4[8] = 0; this.mat4[12] = tx;
        this.mat4[1] = 0; this.mat4[5] = sy; this.mat4[9] = 0; this.mat4[13] = ty;
        this.mat4[2] = 0; this.mat4[6] = 0; this.mat4[10] = sz; this.mat4[14] = tz;
        this.mat4[3] = 0; this.mat4[7] = 0; this.mat4[11] = 0; this.mat4[15] = 1;
    }

    /*------SET FRUSTUM FOR PROJECTION MATRIX------*/
    frustum(left, right, bottom, top, near, far) {
        if (left === right || bottom === top || near === far) {
            this.log('FRUSTUM MATRIX -- INVALID INPUT', 'WARN');
            return;
        }
        if (near <= 0 || far <= 0) {
            this.log('FRUSTUM MATRIX -- INVALID INPUT -- NEAR AND FAR MUST BE ABSOLUTE', 'WARN');
            return;
        }
        let sx = 2 * near / (right - left);
        let sy = 2 * near / (top - bottom);
        let c2 = - (far + near) / (far - near);
        let c1 = 2 * near * far / (near - far);
        let tx = -near * (left + right) / (right - left);
        let ty = -near * (bottom + top) / (top - bottom);
        this.mat4[0] = sx; this.mat4[4] = 0; this.mat4[8] = 0; this.mat4[12] = tx;
        this.mat4[1] = 0; this.mat4[5] = sy; this.mat4[9] = 0; this.mat4[13] = ty;
        this.mat4[2] = 0; this.mat4[6] = 0; this.mat4[10] = c2; this.mat4[14] = c1;
        this.mat4[3] = 0; this.mat4[7] = 0; this.mat4[11] = -1; this.mat4[15] = 0;
    }

    /*------SET PERSPECTIVE PROJECTION MATRIX------*/
    perspective(fovy, aspect, near, far) {
        if (fovy <= 0 || fovy >= Math.PI * 2 || aspect <= 0 || near >= far || near <= 0) {
            this.log('PERSPECTIVE MATRIX -- INVALID INPUT', 'WARN');
            this.identity();
            return;
        }
        else {
            let hf = fovy / 2;
            let tp = near * Math.tan(hf);
            let bp = -tp;
            let rp = tp * aspect;
            let lp = -rp;
            this.frustum(lp, rp, bp, tp, near, far);
        }
    }

    /*------SCALE THE MATRIX------*/
    scale(x, y, z) {
        if (arguments.length === 3) {
            if (x instanceof Array) {
                x = x[0];
                y = x[1];
                z = x[2];
            }
            else if (x instanceof Vec3) {
                x = x.x;
                y = x.y;
                z = x.z;
            }
            if (typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') {
                this.log('MATRIX SCALING -- INVALID INPUT', 'WARN');
                return;
            }
            this.mat4[0] *= x,
                this.mat4[1] *= x,
                this.mat4[2] *= x,
                this.mat4[3] *= x,
                this.mat4[4] *= y,
                this.mat4[5] *= y,
                this.mat4[6] *= y,
                this.mat4[7] *= y,
                this.mat4[8] *= z,
                this.mat4[9] *= z,
                this.mat4[10] *= z,
                this.mat4[11] *= z;
        }
        else {
            this.log('MATRIX SCALING -- INVALID INPUT', 'WARN');
        }
    }

    /*------TRANSLATE THE MATRIX------*/
    translate(m, x, y, z) {
        if (arguments.length === 4) {
            if (!(m instanceof Matrix) || typeof x !== 'number' || typeof y !== 'number' || typeof z !== 'number') {
                this.log('MATRIX TRANSLATION -- INVALID INPUT', 'WARN');
                return;
            }
            this.mat4[12] += this.mat4[0] * x + this.mat4[4] * y + this.mat4[8] * z,
                this.mat4[13] += this.mat4[1] * x + this.mat4[5] * y + this.mat4[9] * z,
                this.mat4[14] += this.mat4[2] * x + this.mat4[6] * y + this.mat4[10] * z,
                this.mat4[15] += this.mat4[3] * x + this.mat4[7] * y + this.mat4[11] * z;
        }
        else if (arguments.length === 3) {
            if (typeof m !== 'number' || typeof x !== 'number' || typeof y !== 'number') {
                this.log('MATRIX TRANSLATION -- INVALID INPUT', 'WARN');
                return;
            }
            this.mat4[12] += this.mat4[0] * m + this.mat4[4] * x + this.mat4[8] * y,
                this.mat4[13] += this.mat4[1] * m + this.mat4[5] * x + this.mat4[9] * y,
                this.mat4[14] += this.mat4[2] * m + this.mat4[6] * x + this.mat4[10] * y,
                this.mat4[15] += this.mat4[3] * m + this.mat4[7] * x + this.mat4[11] * y;
        }
        else {
            this.log('MATRIX TRANSLATION -- INVALID INPUT -- REQUIRES 3 OR 4 ARGUMENTS', 'WARN');
        }
    }

    /*------ROTATE UPON AN ARBITRARY AXIS------*/
    rotate(ang, xA, yA, zA) {
        if (arguments.length !== 4) {
            this.log('MATRIX ROTATION -- INVALID INPUT', 'WARN');
            return;
        }
        else if (typeof ang !== 'number' || (typeof xA !== 'number' && !(xA instanceof Vec3) && !(xA instanceof Array)) || typeof yA !== 'number' || typeof zA !== 'number') {
            this.log('MATRIX ROTATION -- INVALID INPUT', 'WARN');
            return;
        }
        if (xA instanceof Array) {
            xA = xA[0];
            yA = xA[1];
            zA = xA[2];
        }
        else if (xA instanceof Vec3) {
            xA = xA.x;
            yA = xA.y;
            zA = xA.z;
        }
        let tn = Math.sqrt(xA * xA + yA * yA + zA * zA),
            t1 = (xA *= 1 / tn, yA *= 1 / tn, zA *= 1 / tn, this.mat4[0]),
            t2 = this.mat4[1], i = this.mat4[2], a = this.mat4[3],
            t3 = this.mat4[4], u = this.mat4[5], c = this.mat4[6],
            t4 = this.mat4[7], h = this.mat4[8], f = this.mat4[9],
            t5 = this.mat4[10], m = this.mat4[11],
            y = Math.sin(ang), an = Math.cos(ang), g = 1 - an, v = xA * xA * g + an,
            b = yA * xA * g + zA * y, j = zA * xA * g - yA * y, ut = xA * yA * g - zA * y,
            x = yA * yA * g + an, w = zA * yA * g + xA * y, S = xA * zA * g + yA * y,
            ta = yA * zA * g - xA * y, tb = zA * zA * g + an;
        return this.mat4[0] = t1 * v + t3 * b + h * j,
            this.mat4[1] = t2 * v + u * b + f * j,
            this.mat4[2] = i * v + c * b + t5 * j,
            this.mat4[3] = a * v + t4 * b + m * j,
            this.mat4[4] = t1 * ut + t3 * x + h * w,
            this.mat4[5] = t2 * ut + u * x + f * w,
            this.mat4[6] = i * ut + c * x + t5 * w,
            this.mat4[7] = a * ut + t4 * x + m * w,
            this.mat4[8] = t1 * S + t3 * ta + h * tb,
            this.mat4[9] = t2 * S + u * ta + f * tb,
            this.mat4[10] = i * S + c * ta + t5 * tb,
            this.mat4[11] = a * S + t4 * ta + m * tb;
    }

    /*------EXTRACT EULER ROTATION VECTOR IN RADIANS------*/
    toEuler() { // ROW MAJOR -- Y-X-Z -- MATH IS HARD
        const euler = new Vec3();
        euler.x = Math.asin(-this.mat4[9]); // [3_2]
        if (Math.cos(euler.x) > 0.0001) {
            euler.y = Math.atan2(this.mat4[8], this.mat4[10]); // [3_1] [3_3]
            euler.z = Math.atan2(this.mat4[1], this.mat4[5]); // [1_2] [2_2]
        }
        else {
            euler.y = 0;
            euler.z = Math.atan2(-this.mat4[4], this.mat4[0]); // [2_1] [1_1]
        }
        return euler;
    }
}