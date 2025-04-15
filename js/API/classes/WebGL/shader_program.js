'use strict';

/*------GENERIC SHADER PROGRAM CLASS------*/
class ShaderProgram extends Interface {
    constructor(vertexSource, fragmentSource, id = 'ANON-SHADER-PROGRAM') {
        super(id);
        this.vertexSource = vertexSource;
        this.fragmentSource = fragmentSource;
        this.program = null;
    }

    /*------ASSIGN DATA LOCATIONS TO SHADERS IF THE DATA EXISTS------*/
    initialize() {
        this.local_root = this.root;
        const v = ShaderProgram.compileShader(this.gl, this.vertexSource, 'vertex');
        const f = ShaderProgram.compileShader(this.gl, this.fragmentSource, 'fragment');
        this.program = ShaderProgram.createProgram(this.gl, v, f);
        if (this.gl.getUniformLocation(this.program, 'uPhong') !== -1) {
            this.program.uPhong = this.gl.getUniformLocation(this.program, 'uPhong');
        }
        if (this.gl.getUniformLocation(this.program, 'uProjectionMatrix') !== -1) {
            this.program.uProjectionMatrix = this.gl.getUniformLocation(this.program, 'uProjectionMatrix');
        }
        if (this.gl.getUniformLocation(this.program, 'uModelViewMatrix') !== -1) {
            this.program.uModelViewMatrix = this.gl.getUniformLocation(this.program, 'uModelViewMatrix');
        }
        if (this.gl.getUniformLocation(this.program, 'uNormalMatrix') !== -1) {
            this.program.uNormalMatrix = this.gl.getUniformLocation(this.program, 'uNormalMatrix');
        }
        if (this.gl.getAttribLocation(this.program, 'aVertexPosition') !== -1) {
            this.program.aVertexPosition = this.gl.getAttribLocation(this.program, 'aVertexPosition');
        }
        if (this.gl.getAttribLocation(this.program, 'aVertexNormal') !== -1) {
            this.program.aVertexNormal = this.gl.getAttribLocation(this.program, 'aVertexNormal');
        }
        if (this.gl.getAttribLocation(this.program, 'vVertexColor') !== -1) {
            this.program.vVertexColor = this.gl.getAttribLocation(this.program, 'vVertexColor');
        }
        if (this.gl.getUniformLocation(this.program, 'uMaterialAmbient') !== -1) {
            this.program.uMaterialAmbient = this.gl.getUniformLocation(this.program, 'uMaterialAmbient');
        }
        if (this.gl.getUniformLocation(this.program, 'uMaterialDiffuse') !== -1) {
            this.program.uMaterialDiffuse = this.gl.getUniformLocation(this.program, 'uMaterialDiffuse');
        }
        if (this.gl.getUniformLocation(this.program, 'uMaterialSpecular') !== -1) {
            this.program.uMaterialSpecular = this.gl.getUniformLocation(this.program, 'uMaterialSpecular');
        }
        if (this.gl.getUniformLocation(this.program, 'uShininess') !== -1) {
            this.program.uShininess = this.gl.getUniformLocation(this.program, 'uShininess');
        }
        if (this.gl.getUniformLocation(this.program, 'uLightAmbient') !== -1) {
            this.program.uLightAmbient = this.gl.getUniformLocation(this.program, 'uLightAmbient');
        }
        if (this.gl.getUniformLocation(this.program, 'uLightDiffuse') !== -1) {
            this.program.uLightDiffuse = this.gl.getUniformLocation(this.program, 'uLightDiffuse');
        }
        if (this.gl.getUniformLocation(this.program, 'uLightSpecular') !== -1) {
            this.program.uLightSpecular = this.gl.getUniformLocation(this.program, 'uLightSpecular');
        }
        if (this.gl.getUniformLocation(this.program, 'uLightDirection') !== -1) {
            this.program.uLightDirection = this.gl.getUniformLocation(this.program, 'uLightDirection');
        }
        if (this.gl.getUniformLocation(this.program, 'uLightPosition') !== -1) {
            this.program.uLightPosition = this.gl.getUniformLocation(this.program, 'uLightPosition');
        }
    }

    /*------USE THIS ESSL PROGRAM------*/
    use() {
        this.local_root.program = this;
        this.gl.useProgram(this.program);
    }

    /*------COMPILE A SPECIFIC SHADER------*/
    static compileShader(gl, src, type) {
        let shader;
        if (type === 'vertex') {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        else if (type === 'fragment') {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        else {
            return null;
        }
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('FAILED TO COMPILE SHADER', gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    /*------CREATE AN ESSL PROGRAM------*/
    static createProgram(gl, vertex, fragment) {
        const program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('FAILED TO LINK PROGRAM');
            return null;
        }
        return program;
    }
}