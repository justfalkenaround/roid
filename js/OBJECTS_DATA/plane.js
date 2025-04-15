'use strict';

/*------PLANE GEOMETRY CLASS------*/
class Plane extends Geometry {
    constructor(size = 2, lines = 100, axis = 1, id) {
        const data = Plane._buildPlane(size, lines, axis);
        data.renderingMode = 'LINES';
        data.descriptor = 'PLANE';
        super(data, id);
    }

    /*------CREATE SELF BASED ON PARAMETERS------*/
    static _buildPlane(size = 2, lines = 100, axis = 1) {
        lines = 2 * size / lines;
        const inc = 2 * size / lines;
        const v = [];
        const i = [];
        for (let l = 0; l <= lines; l++) {
            v[6 * l] = -size;
            v[6 * l + 1] = 0;
            v[6 * l + 2] = -size + (l * inc);
            v[6 * l + 3] = size;
            v[6 * l + 4] = 0;
            v[6 * l + 5] = -size + (l * inc);
            v[6 * (lines + 1) + 6 * l] = -size + (l * inc);
            v[6 * (lines + 1) + 6 * l + 1] = 0;
            v[6 * (lines + 1) + 6 * l + 2] = -size;
            v[6 * (lines + 1) + 6 * l + 3] = -size + (l * inc);
            v[6 * (lines + 1) + 6 * l + 4] = 0;
            v[6 * (lines + 1) + 6 * l + 5] = size;
            i[2 * l] = 2 * l;
            i[2 * l + 1] = 2 * l + 1;
            i[2 * (lines + 1) + 2 * l] = 2 * (lines + 1) + 2 * l;
            i[2 * (lines + 1) + 2 * l + 1] = 2 * (lines + 1) + 2 * l + 1;
        }
        if (axis === 2) {
            for (let l = 0, j = v.length; l < j; l += 3) {
                v[l + 1] = v[l];
                v[l] = 0.0;
            }
        }
        else if (axis === 3) {
            for (let l = 0, j = v.length; l < j; l += 3) {
                v[l + 1] = v[l + 2];
                v[l + 2] = 0.0;
            }
        }
        return { vertices: v, indices: i };
    }
}