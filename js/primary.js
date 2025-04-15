'use strict';

/*------ROOT TREE CLASS------*/
class Root extends ObjectList {
    constructor(div, canvas, id = 'ROOT') {
        super(id);
        this.optimize = false;
        this.frameRateBuffer = [];
        for (let i = 0; i < 20; i++) {
            this.frameRateBuffer.push(16.7);
        }
        this.audioManager = new AudioManager('AUDIO_MANAGER');
        this.add(this.audioManager);
        this.initializeSoundToggle();
        this.assets = new Assets('ASSETS');
        this.add(this.assets);
        this.assets.load(ROID_SOUND, 'AUDIO', 'ROID_SOUND');
        this.assets.load(PHASER_SOUND, 'AUDIO', 'PHASER_SOUND');
        this.assets.load(ALIEN_SOUND, 'AUDIO', 'ALIEN_SOUND');
        this.assets.wait(() => {
            this.initialize(div, canvas, canvas_2);
        });
    }

    /*------ENSURE USER CAN DISABLE SOUND EFFECTS------*/
    initializeSoundToggle() {
        this.soundToggle = document.querySelector('[data-sound]');
        if (this.soundToggle) {
            if (!eval(this.soundToggle.dataset.sound)) {
                this.audioManager.mainGainNode.gain.value = 1;
            }
            else if (eval(this.soundToggle.dataset.sound)) {
                this.audioManager.mainGainNode.gain.value = 0;
            }
            this.soundToggle.addEventListener('click', () => {
                if (!eval(this.soundToggle.dataset.sound)) {
                    this.audioManager.mainGainNode.gain.value = 1;
                }
                else if (eval(this.soundToggle.dataset.sound)) {
                    this.audioManager.mainGainNode.gain.value = 0;
                }
            });
        }
    }

    /*------CREATE ALL OF THE CLASS INSTANCES IN THE TREE------*/
    initialize(div, canvas, canvas_2) {
        this.assets.ROID_SOUND = this.assets.find('ROID_SOUND');
        this.assets.PHASER_SOUND = this.assets.find('PHASER_SOUND');
        this.assets.ALIEN_SOUND = this.assets.find('ALIEN_SOUND');
        this.audioManager.playTrack(this.assets.ROID_SOUND, [0, 0.42]);
        this.audioManager.playTrack(this.assets.ALIEN_SOUND, [0, 68, 5]);
        this.audioManager.loopTrack(this.assets.ALIEN_SOUND, [0, 72, 5]);
        this.timeElapsed = 0;
        this.timeStamp = 0;
        this.skeletonMode = false;
        this.godMode = false;
        this.canvas = new Canvas(div, canvas, canvas_2, 2400, 1200, 'CANVAS');
        GL = this.canvas.context;
        this.add(this.canvas);
        this.canvas.resize();
        this.fieldOfView = 45 * Math.PI / 180;
        this.aspect = this.canvas.aspectRatio;
        this.zNear = 0.1;
        this.zFar = 100000000;
        this.camera = new Camera();
        this.add(this.camera);
        this.modelViewMatrix = this.camera.viewTransform;
        this.normalMatrix = new Matrix();
        this.projectionMatrix = new Matrix();
        this.projectionMatrix.perspective(this.fieldOfView, this.aspect, this.zNear, this.zFar);
        this.initializeShaders();
        this.program = this.programs.find('PHONG_PHONG');
        this.sun = new Light('DIRECTIONAL');
        this.add(this.sun);
        this.mouse = new Mouse('MOUSE');
        this.add(this.mouse);
        this.touch = new Touch('TOUCH');
        this.add(this.touch);
        this.keyboard = new Keyboard('KEYBOARD');
        this.add(this.keyboard);
        this.stateManager = new StateManager('STATE_MANAGER');
        this.add(this.stateManager);
        this.stateManager.add(new WorldState('WORLD_STATE'));
        super.initialize();
        const loadingIcon = document.querySelector('.loading');
        if (loadingIcon) {
            loadingIcon.remove();
        }
        this.program.use();
        this.mainLoop();
    }

    /*------CALCULATE FRAME-RATE AND RENDER WORLD------*/
    render() {
        this.frameRateBuffer.unshift(this.timeElapsed);
        this.frameRateBuffer.pop();
        if (this.avgFrameRate > 18) {
            this.optimize = true;
        }
        else {
            this.optimize = false;
        }
        this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
        this.canvas.clear();
        this.projectionMatrix.perspective(this.fieldOfView, this.aspect, this.zNear, this.zFar);
        this.modelViewMatrix = this.camera.viewTransform;
        this.normalMatrix = this.camera.matrix.copy();
        this.normalMatrix.transpose();
        this.updateMatrix();
        super.render();
    }

    /*------UPDATE GPU MATRIX DATA------*/
    updateMatrix() {
        this.gl.uniformMatrix4fv(this.program.program.uProjectionMatrix, false, this.projectionMatrix.mat4);
        this.gl.uniformMatrix4fv(this.program.program.uModelViewMatrix, false, this.modelViewMatrix.mat4);
        this.gl.uniformMatrix4fv(this.program.program.uNormalMatrix, false, this.normalMatrix.mat4);
    }

    /*------BEATING HEART OF THE PROGRAM -- MAIN ANIMATION LOOP------*/
    mainLoop(timeStamp) {
        this.timeElapsed = timeStamp - this.timeStamp;
        this.update();
        this.render();
        this.timeStamp = timeStamp;
        window.requestAnimationFrame((timeStamp) => {
            this.mainLoop(timeStamp);
        });
    }

    /*------CREATE/COMPLILE ANY AND ALL SHADERS------*/
    initializeShaders() {
        this.programs = new ObjectList('PROGRAMS');
        this.add(this.programs);
        for (let p in SHADERS) {
            this.programs.add(new ShaderProgram(SHADERS[p].VERTEX, SHADERS[p].FRAGMENT, p));
        }
    }

    /*------HANDLE INPUT FOR ALL------*/
    handleInput(e) {
        super.handleInput(e);
    }

    /*------FRAME-RATE CALCULATOR------*/
    get avgFrameRate() {
        let avg = 0;
        for (let i = 0, j = this.frameRateBuffer.length; i < j; i++) {
            avg += this.frameRateBuffer[i];
        }
        avg /= this.frameRateBuffer.length;
        return avg;
    }
}

/*------GLOBAL HANDLES FOR OPTIMIZATIONS/DEBUGGING------*/
let GL;
let GAME;

/*------ENTER PROGRAM -- CLEAN UP AFTER THE WEBSITE------*/
const ENTRY_POINT = () => {
    window.cancelAnimationFrame(PRIMARY.frame);
    document.querySelector('#gl-canvas').classList.add('pointer');
    document.querySelector('#canvas_2').classList.add('pointer');
    document.querySelector('.orientation-modal').style.display = '';
    document.querySelector('header h1').remove();
    document.querySelector('.asteroids').remove();
    document.querySelector('.play-button').remove();
    document.querySelector('.loading').style.display = 'flex';
    GAME = new Root(document.querySelector('#gl-div'), document.querySelector('#gl-canvas'), document.querySelector('#canvas_2'));
};

/*------LOAD LISTENER------*/
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.play-button div').addEventListener('click', () => {
        ENTRY_POINT();
    });
});