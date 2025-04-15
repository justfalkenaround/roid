'use strict';

/*------PROJECTILE GEOMETRY CLASS------*/
class Projectile extends Geometry {
    constructor(rot, id) {
        const data = {};
        data.renderingMode = 'LINES';
        data.vertices = Cube._vertices;
        data.indices = Cube._indices;
        data.color = [1, 0, 0, 1];
        data.shininess = 5;
        super(data, id);
        this.radius = new Vec3(0.5, 0.5, 0.5);
        this.tracers = [];
        this.rotation = rot;
        this.iter = 1;
        this.bounding = true;
        this.local_root = this.root;
    }

    /*------CREATE VISUAL TRACERS ONLY IF FRAME-RATE IS LOW ENOUGH------*/
    update() {
        if (!this.local_root.optimize && !this.alternate) {
            if (this.iter % 5 === 0) {
                let tracer = Utilities.buildTrail(15, 12);
                this.tracers.push(tracer);
                tracer.position = this.position.copy();
                tracer.rotation = this.rotation.copy();
                this.parent.add(tracer);
                tracer.initialize();
                if (this.iter > 70) {
                    this.tracers[0].depracated = true;
                    this.tracers.shift();
                }
            }
        }
        else if (this.tracers.length > 0) {
            if (this.iter % 5 === 0) {
                this.tracers[0].depracated = true;
                this.tracers.shift();
            }
        }
        this.iter++;
        if (this.iter > 600) {
            this.depracate();
        }
        super.update();
    }

    /*------SCHEDULE FOR DELETION------*/
    depracate() {
        if (this.depracated) {
            return;
        }
        this.depracated = true;
        for (let k = 0, g = this.tracers.length; k < g; k++) {
            this.tracers[k].depracated = true;
        }
    }
}