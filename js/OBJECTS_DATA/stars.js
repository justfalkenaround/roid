'use strict';

/*------STARS GEOMETRY CLASS------*/
class Stars extends Geometry {
    constructor(density, radius, min, id = 'STARS') {
        const data = Stars.buildStars(density, radius, min);
        super(data, id);
        this.scaleFactor = new Vec3(0, 0, 0);
        this.additive = this.scaleFactor.copy();
    }

    /*------EXPAND LIKE AN EXPLOSION------*/
    update() {
        this.scaleFactor.add(this.additive);
        this.scale.add(this.scaleFactor);
        super.update();
    }

    /*------GENERATE VERTICES/INDICES ECT------*/
    static buildStars(density = 50, radius = 1, min = 0) {
        let v = [];
        let i = [];
        let r = radius;
        let degs = (density * 2) / 360;
        let deg = 0;
        for (let j = 0; j < density * 2; j++) {
            deg += degs;
            let rads = (deg * Math.PI) / 180;
            let x = r * Math.random() * Math.sin(rads * Math.random()) * Math.cos(deg) + min;
            let y = r * Math.random() * Math.sin(rads * Math.random()) * Math.sin(deg) + min;
            let z = r * Math.random() * Math.cos(rads * Math.random()) + min;
            v.push(x);
            v.push(y);
            v.push(z);
        }
        for (let m = 0; m < v.length / 3; m++) {
            i.push(m);
        }
        return {
            vertices: v,
            indices: i,
            descriptor: 'STARS',
            color: [1, 1, 1, 1],
            renderingMode: 'POINTS',
        };
    }
}