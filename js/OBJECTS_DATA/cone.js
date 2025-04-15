'use strict';

/*------CONE GEOMETRY CLASS------*/
class Cone extends Geometry {
    constructor(id) {
        const data = {};
        data.renderingMode = 'TRIANGLES';
        data.descriptor = 'CONE';
        data.vertices = Cone._vertices;
        data.indices = Cone._indices;
        data.flatShading = true;
        data.shininess = 5;
        data.colors = Cone._colors;
        super(data, id);
    }

    /*------VERTICES/INDICES------*/
    static get _vertices() {
        return [
            0.75, 0.0, 0.0,
            -0.75, 0.5, 0.0,
            -0.75, 0.4045085, 0.2938925,
            -0.75, 0.1545085, 0.4755285,
            -0.75, -0.1545085, 0.4755285,
            -0.75, -0.4045085, 0.2938925,
            -0.75, -0.5, 0.0,
            -0.75, -0.4045085, -0.2938925,
            -0.75, -0.1545085, -0.4755285,
            -0.75, 0.1545085, -0.4755285,
            -0.75, 0.4045085, -0.2938925,
        ];
    }

    static get _indices() {
        return [
            0, 1, 2,
            0, 2, 3,
            0, 3, 4,
            0, 4, 5,
            0, 5, 6,
            0, 6, 7,
            0, 7, 8,
            0, 8, 9,
            0, 9, 10,
            0, 10, 1,
        ];
    }

    /*------COLORFULL------*/
    static get _colors() {
        return [
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 1, 1, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            0, 0, 1, 1,
            1, 1, 0, 1,
            1, 1, 0, 1,
            1, 1, 0, 1,
            1, 1, 0, 1,
            1, 0, 1, 1,
            1, 0, 1, 1,
            1, 0, 1, 1,
            1, 0, 1, 1
        ];
    }
}