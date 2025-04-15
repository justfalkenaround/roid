"use strict";

/*------MOUSE MANAGER------*/
class Mouse extends Interface {
    constructor(id = 'ANON-MOUSE') {
        super(id);
        this.position = new Vec2();
        this.left = new ButtonState();
        this.middle = new ButtonState();
        this.right = new ButtonState();

    }

    /*------ATTACH LISTENERS------*/
    initialize() {
        this.local_root = this.root;
        document.addEventListener("mousemove", (e) => {
            this.handleMouseMove(e);
            if (this.local_root) {
                this.local_root.handleInput(e);
            }
        });
        document.addEventListener("mousedown", (e) => {
            this.handleMouseDown(e);
            if (this.local_root) {
                this.local_root.handleInput(e);
            }
        });
        document.addEventListener("mouseup", (e) => {
            this.handleMouseUp(e);
            if (this.local_root) {
                this.local_root.handleInput(e);
            }
        });
    }

    /*------ADJUST BUTTONSTATES------*/
    update() {
        this.left.pressed = false;
        this.middle.pressed = false;
        this.right.pressed = false;
    }

    /*------HANDLERS------*/
    handleMouseMove(e) {
        this.position.x = (e.pageX - this.local_root.canvas.offset.x) / this.local_root.canvas.scale.x;
        this.position.y = (e.pageY - this.local_root.canvas.offset.y) / this.local_root.canvas.scale.y;
    }

    handleMouseDown(e) {
        if (e.which === 1) {
            if (!this.left.down) {
                this.left.pressed = true;
            }
            this.left.down = true;
        }
        if (e.which === 2) {
            if (!this.middle.down) {
                this.middle.pressed = true;
            }
            this.middle.down = true;
        }
        if (e.which === 3) {
            if (!this.right.down) {
                this.right.pressed = true;
            }
            this.right.down = true;
        }
    }

    handleMouseUp(e) {
        if (e.which === 1) {
            this.left.down = false;
        }
        if (e.which === 2) {
            this.middle.down = false;
        }
        if (e.which === 3) {
            this.right.down = false;
        }
    }

    /*------POINT INTERSECTION DETECTION------*/
    containsMousePress(shape) {
        if (shape.contains(new Vec2(this.position.x, this.position.y)) && this.left.pressed) {
            return true;
        }
        else {
            return false;
        }
    }

    containsMouseDown(shape) {
        if (shape.contains(new Vec2(this.position.x, this.position.y)) && this.left.down) {
            return true;
        }
        else {
            return false;
        }
    }
}