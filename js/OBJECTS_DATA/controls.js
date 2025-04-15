'use strict';

/*------GAME CONTROLS MANAGER------*/
class Controls extends Interface {
    constructor(id = 'ANON-CONTROLS') {
        super(id);
        this.speed = 0.25;
        this.turnSpeed = 0.015;
        this.inverted = true;
    }

    /*------GET READY ATTACH LISTENERS------*/
    initialize() {
        this.local_root = this.root;
        document.onfullscreenerror = (err) => {
            this.log(`FULLSCREEN REQUEST FAILED: RESETTING`, 'WARN');
            this.disableFullScreen();
        };
        document.onpointerlockerror = (err) => {
            this.log(`POINTERLOCK REQUEST FAILED: RESETTING`, 'WARN');
            this.disableFullScreen();
        };
        window.addEventListener('resize', () => { this.initializeTouchAreas() });
        this.initializeTouchAreas();
        super.initialize();
    }

    /*------CREATE BOXES FOR TOUCH INTERFACE------*/
    initializeTouchAreas() {
        this.boxes = [];
        this.boxView = new Rectangle(new Vec2(1700, 500), new Vec2(700, 700));
        this.boxViewVisual = this.boxView.copy();
        this.boxViewVisual.scale(this.local_root.canvas.scale);
        this.boxes.push(this.boxViewVisual);
        this.boxMove = new Rectangle(new Vec2(0, 500), new Vec2(700, 700));
        this.boxMoveVisual = this.boxMove.copy();
        this.boxMoveVisual.scale(this.local_root.canvas.scale);
        this.boxes.push(this.boxMoveVisual);
        this.boxFire = new Rectangle(new Vec2(720, 0), new Vec2(960, 1200));
        this.boxFireVisual = this.boxFire.copy();
        this.boxFireVisual.scale(this.local_root.canvas.scale);
        this.boxes.push(this.boxFireVisual);
    }

    /*------CHECK FOR STATE CHANGES EVERY FRAME AND HANDLE------*/
    update() {
        if (this.parent.died) {
            return;
        }
        const cam = this.local_root.camera;
        if (this.local_root.touch.touchDetected) {
            this.updateTouchInterface(cam);
            if (!this.parent.HUD.visualizeBoxes) {
                this.parent.HUD.visualizeBoxes = true;
            }
        }
        if (this.speed > 0) {
            if (this.local_root.keyboard.keyStates[219].down) {
                this.speed -= 0.002;
            }
        }
        else if (this.speed < 0) {
            this.speed = 0;
        }
        if (this.local_root.keyboard.keyStates[221].down) {
            this.speed += 0.002;
        }
        if (this.local_root.godMode) {
            if (this.local_root.keyboard.keyStates[87].down) { // W
                if (cam.type === 'TRACKING') {
                    cam.position.add(cam.normal.times(-this.speed));
                    this.thrust();
                }
                else {
                    cam.position.z += -this.speed;
                }
            }
            if (this.local_root.keyboard.keyStates[65].down) { // A
                if (cam.type === 'TRACKING') {
                    cam.position.add(cam.right.times(-this.speed));
                    this.thrust();
                }
            }
            if (this.local_root.keyboard.keyStates[83].down) { // S
                if (cam.type === 'TRACKING') {
                    cam.position.add(cam.normal.times(this.speed));
                    this.thrust();
                }
                else {
                    cam.position.z += this.speed;
                }
            }
            if (this.local_root.keyboard.keyStates[68].down) { // D
                if (cam.type === 'TRACKING') {
                    cam.position.add(cam.right.times(this.speed));
                    this.thrust();
                }
            }
            if (this.local_root.keyboard.keyStates[81].down) { // Q
                if (cam.type === 'TRACKING') {
                    cam.rotations.z += this.turnSpeed;
                    this.RCS();
                }
            }
            if (this.local_root.keyboard.keyStates[69].down) { // E
                if (cam.type === 'TRACKING') {
                    cam.rotations.z += -this.turnSpeed;
                    this.RCS();
                }
            }
            if (this.local_root.keyboard.keyStates[38].down) { // UP
                cam.rotations.x += this.turnSpeed;
                this.RCS();
            }
            if (this.local_root.keyboard.keyStates[40].down) { // DOWN
                cam.rotations.x += -this.turnSpeed;
                this.RCS();
            }
            if (this.local_root.keyboard.keyStates[37].down) { // LEFT
                cam.rotations.y += this.turnSpeed;
                this.RCS();
            }
            if (this.local_root.keyboard.keyStates[39].down) { // RIGHT
                cam.rotations.y += -this.turnSpeed;
                this.RCS();
            }
        }
        else {
            if (this.parent.fuel > 0) {
                if (this.local_root.keyboard.keyStates[87].down) { // W
                    if (cam.type === 'TRACKING') {
                        cam.velocity.add(cam.normal.times(-this.speed / 50));
                        this.parent.fuel -= 5 * (this.speed / 0.25);
                        this.thrust();
                    }
                    else {
                        cam.velocity.z += -this.speed;
                    }
                }
                if (this.local_root.keyboard.keyStates[65].down) { // A
                    if (cam.type === 'TRACKING') {
                        cam.velocity.add(cam.right.times(-this.speed / 50));
                        this.parent.fuel -= 5 * (this.speed / 0.25);
                        this.thrust();
                    }
                }
                if (this.local_root.keyboard.keyStates[83].down) { // S
                    if (cam.type === 'TRACKING') {
                        cam.velocity.add(cam.normal.times(this.speed / 50));
                        this.parent.fuel -= 5 * (this.speed / 0.25);
                        this.thrust();
                    }
                    else {
                        cam.velocity.z += this.speed;
                    }
                }
                if (this.local_root.keyboard.keyStates[68].down) { // D
                    if (cam.type === 'TRACKING') {
                        cam.velocity.add(cam.right.times(this.speed / 50));
                        this.parent.fuel -= 5 * (this.speed / 0.25);
                        this.thrust();
                    }
                }
                if (this.local_root.keyboard.keyStates[81].down) { // Q
                    if (cam.type === 'TRACKING') {
                        cam.rotations.z += this.turnSpeed / 50;
                        this.parent.fuel -= 0.5;
                        this.RCS();
                    }
                }
                if (this.local_root.keyboard.keyStates[69].down) { // E
                    if (cam.type === 'TRACKING') {
                        cam.rotations.z += -this.turnSpeed / 50;
                        this.parent.fuel -= 0.5;
                        this.RCS();
                    }
                }
                if (this.local_root.keyboard.keyStates[38].down) { // UP
                    cam.rotations.x += this.turnSpeed / 50;
                    this.parent.fuel -= 0.5;
                    this.RCS();
                }
                if (this.local_root.keyboard.keyStates[40].down) { // DOWN
                    cam.rotations.x += -this.turnSpeed / 50;
                    this.parent.fuel -= 0.5;
                    this.RCS();
                }
                if (this.local_root.keyboard.keyStates[37].down) { // LEFT
                    cam.rotations.y += this.turnSpeed / 50;
                    this.parent.fuel -= 0.5;
                    this.RCS();
                }
                if (this.local_root.keyboard.keyStates[39].down) { // RIGHT
                    cam.rotations.y += -this.turnSpeed / 50;
                    this.parent.fuel -= 0.5;
                    this.RCS();
                }
            }
            if (this.parent.fuel < 0) {
                this.parent.fuel = 0;
            }
        }
        super.update();
    }

    /*------TOUCH HANDLER PER FRAME------*/
    updateTouchInterface(cam) {
        if (!this.inverted) {
            if (this.local_root.godMode) {
                if (this.parent.fuel > 0) {
                    const view = this.local_root.touch.containsTouch(this.boxView);
                    if (view) {
                        this.rotate(view.change.x, view.change.y);
                        this.RCS();
                    }
                    const move = this.local_root.touch.containsTouch(this.boxMove);
                    if (move) {
                        this.movePosition(move.magnitude.x, move.magnitude.y, cam);
                        this.thrust();
                    }
                }
            }
            else {
                if (this.parent.fuel > 0) {
                    const view = this.local_root.touch.containsTouch(this.boxView);
                    if (view) {
                        this.rotate(view.change.x, view.change.y);
                        this.RCS();
                    }
                    const move = this.local_root.touch.containsTouch(this.boxMove);
                    if (move) {
                        this.move(move.magnitude.x, move.magnitude.y, cam);
                        this.thrust();
                    }
                }
            }
        }
        else {
            if (this.local_root.godMode) {
                if (this.parent.fuel > 0) {
                    const view = this.local_root.touch.containsTouch(this.boxView);
                    if (view) {
                        this.rotate(view.change.x, view.change.y);
                        this.RCS();
                    }
                    const move = this.local_root.touch.containsTouch(this.boxMove);
                    if (move) {
                        this.movePosition(move.magnitude.x, move.magnitude.y, cam);
                        this.thrust();
                    }
                }
            }
            else {
                if (this.parent.fuel > 0) {
                    const view = this.local_root.touch.containsTouch(this.boxView);
                    if (view) {
                        this.rotate(view.change.x, view.change.y);
                        this.RCS();
                    }
                    const move = this.local_root.touch.containsTouch(this.boxFire);
                    if (move) {
                        this.move(move.magnitude.x, move.magnitude.y, cam);
                        this.thrust();
                    }
                }
            }
        }
    }

    /*------SOUNDS FOR THRUSTERS FIRING------*/
    RCS() {
        if (this.RCS_PLAYING) {
            return;
        }
        const temp = this.local_root.audioManager.playStatic(0.03, [0, 0.2, 1000 / 1000 / 12]);
        this.RCS_PLAYING = true;
        temp.onended = () => { this.RCS_PLAYING = false };
    }

    thrust() {
        if (this.THRUST_PLAYING) {
            return;
        }
        const temp = this.local_root.audioManager.playStatic(0.03, [0, 0.2, 1000 / 1000 / 12]);
        this.THRUST_PLAYING = true;
        temp.onended = () => { this.THRUST_PLAYING = false };
    }

    /*------INPUT EVENT HANDLER------*/
    handleInput(e) {
        if (this.local_root.keyboard.keyStates[32].pressed) {
            this.parent.fire = true;
        }
        if (this.local_root.mouse.left.pressed && document.pointerLockElement) {
            this.parent.fire = true;
        }
        if (!this.inverted) {
            if (this.local_root.touch.touchDetected && this.local_root.touch.containsTouchPress(this.boxFire)) {
                this.parent.fire = true;
            }
        }
        else {
            if (this.local_root.touch.touchDetected && this.local_root.touch.containsTouchPress(this.boxMove)) {
                this.parent.fire = true;
            }
        }
        this.local_root.touch.containsTouch(this.boxView);
        if (this.local_root.keyboard.keyStates[84].pressed && this.local_root.godMode) {
            this.local_root.camera.type = 'TRACKING';
        }
        if (this.local_root.keyboard.keyStates[79].pressed && this.local_root.godMode) {
            this.local_root.camera.type = 'ORBITING';
        }
        if (this.local_root.keyboard.keyStates[71].pressed && this.local_root.godMode) {
            this.local_root.godMode = !this.local_root.godMode;
            this.local_root.camera.velocity = new Vec3();
        }
        if (this.local_root.keyboard.keyStates[77].pressed && this.local_root.godMode) {
            this.local_root.skeletonMode = !this.local_root.skeletonMode;
        }
        if (!document.pointerLockElement && !document.fullScreenElement) {
            if ((this.local_root.mouse.left.pressed) && (e.target.id === 'gl-div' || e.target.id === 'gl-canvas' || e.target.id === 'canvas_2')) {
                this.enableFullScreen();
            }
        }
        if (document.pointerLockElement) {
            this.rotate(e.movementX, e.movementY);
        }
        super.handleInput();
    }

    /*------ATEMPT TO ENABLE FULLSCREEN/POINTERLOCK------*/
    enableFullScreen() {
        try {
            if (!document.pointerLockElement) {
                this.local_root.canvas.div.requestPointerLock().catch((err) => { this.disableFullScreen() });
            }
        }
        catch (err) {
            this.disableFullScreen();
            this.log(`FULLSCREEN API FAILURE: RESETTING`, 'WARN');
        }
        try {
            if (!document.fullScreenElement) {
                this.local_root.canvas.div.requestFullscreen().catch((err) => { this.disableFullScreen() });
            }
        }
        catch (err) {
            this.disableFullScreen();
            this.log(`POINTER API FAILURE: RESETTING`, 'WARN');
        }
    }

    /*------DISABLE FULLSCREEN/POINTERLOCK ON FAILURE------*/
    disableFullScreen() {
        if (document.fullScreenElement) {
            document.exitFullscreen();
        }
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }

    /*------ROTATE VIEW BASED ON CHANGE IN TWO DIMENSIONS------*/
    rotate(dx = 0, dy = 0) {
        if (!this.local_root.godMode) {
            dx /= 50;
            dy /= 50;
            if (this.parent.fuel <= 0) {
                return;
            }
            this.parent.fuel -= Math.abs(dx * 10);
            this.parent.fuel -= Math.abs(dy * 10);
        }
        this.local_root.camera.rotations.x += (-dy / 500);
        this.local_root.camera.rotations.y += (-dx / 500);
    }

    /*------CHANGE VELOCITY BASED ON CHANGE IN TWO DIMENSIONS------*/
    move(mx = 0, my = 0, cam) {
        if (cam.type === 'TRACKING') {
            cam.velocity.add(cam.normal.times((this.speed * my)));
            cam.velocity.add(cam.right.times((this.speed * mx)));
            this.parent.fuel -= Math.abs(mx * 250);
            this.parent.fuel -= Math.abs(my * 250);
        }
        else {
            cam.velocity.z += -this.speed * my;
        }
    }

    /*------CHANGE VELOCITY BASED ON CHANGE IN TWO DIMENSIONS------*/
    movePosition(mx = 0, my = 0, cam) {
        if (cam.type === 'TRACKING') {
            cam.position.add(cam.normal.times((this.speed * my)));
            cam.position.add(cam.right.times((this.speed * mx)));
        }
        else {
            cam.position.z += -this.speed * my;
        }
    }
}