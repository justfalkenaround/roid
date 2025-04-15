'use strict';

/*------GENERIC LIGHT CLASS -- incomplete ------*/
class Light extends Interface {
    constructor(type = 'DIRECTIONAL', LC = new Vec4(1, 1, 1, 1), LA = new Vec4(0.03, 0.03, 0.03, 1), LS = new Vec4(1, 1, 1, 1), LD = new Vec3(-0.25, -0.25, -0.25), LP = new Vec3(1, 1, 1), id = 'ANON-LIGHT') {
        super(id);
        this.type = type;
        this.lightColor = LC;
        this.lightAmbient = LA;
        this.lightSpecular = LS;
        if (this.type === 'POSITIONAL') {
            this.lightPosition = LP;
        }
        else {
            this.lightDirection = LD;
        }
    }

    /*------OPTIMIZE------*/
    initialize() {
        this.local_root = this.root;
    }

    /*------UPDATE GPU DATA------*/
    update() {
        this.updateGPU();
    }

    updateGPU() {
        if (this.type === 'POSITIONAL') {
            this.gl.uniform3fv(this.local_root.program.program.uLightDirection, this.lightPosition.array);
        }
        else {
            this.gl.uniform3fv(this.local_root.program.program.uLightDirection, this.lightDirection.array);
        }
        this.gl.uniform4fv(this.local_root.program.program.uLightDiffuse, this.lightColor.array);
        this.gl.uniform4fv(this.local_root.program.program.uLightAmbient, this.lightAmbient.array);
        this.gl.uniform4fv(this.local_root.program.program.uLightSpecular, this.lightSpecular.array);
    }
}