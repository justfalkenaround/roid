"use strict";

// ------------------------------------------------------
// TO DISABLE DEFAULT TOUCH BEHAVIOR:
// SET HTML META TAG TO: <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
// SET CSS PROPERTY OF touch-action: none; to the HTML ELEMENT
// ADD {passive: false} TO ANY TOUCH EVENT LISTENERS
// ------------------------------------------------------

/*------TOUCH MANAGER------*/
class Touch extends Interface {
  constructor(id = 'ANON-TOUCH') {
    super(id);
    this.touches = [];
    this.touchPresses = [];
    this.touchDetected = false;

  }

  /*------ATTACH LISTENERS------*/
  initialize() {
    this.local_root = this.root;
    document.addEventListener("touchstart", (e) => {
      this.handleTouchStart(e);
      if (this.local_root) {
        this.local_root.handleInput(e);
      }
    }, { passive: false });
    document.addEventListener("touchend", (e) => {
      this.handleTouchEnd(e);
      if (this.local_root) {
        this.local_root.handleInput(e);
      }
    }, { passive: false });
    document.addEventListener("touchcancel", (e) => {
      this.handleTouchEnd(e);
      if (this.local_root) {
        this.local_root.handleInput(e);
      }
    }, { passive: false });
    document.addEventListener("touchleave", (e) => {
      this.handleTouchEnd(e);
      if (this.local_root) {
        this.local_root.handleInput(e);
      }
    }, { passive: false });
    document.body.addEventListener("touchmove", (e) => {
      this.handleTouchMove(e);
      if (this.local_root) {
        this.local_root.handleInput(e);
      }
    }, { passive: false });
  }

  /*------ADJUST BUTTONSTATES------*/
  update() {
    for (let i = 0; i < this.touchPresses.length; i++) {
      this.touchPresses[i] = false;
    }
  }

  /*------HANDLERS FOR AN ARBITRARY NUMBER OF TOUCHES------*/
  handleTouchStart(e) {
    e.preventDefault();
    if (!this.touchDetected) {
      this.touchDetected = true;
    }
    let mTouches = e.changedTouches;
    for (let i = 0; i < mTouches.length; i++) {
      this.touches.push(mTouches[i]);
      this.touchPresses.push(true);
    }
    for (let i = 0; i < this.touches.length; ++i) {
      this.touches[i].position = new Vec2();
      this.touches[i].previousPosition = new Vec2();
      this.touches[i].change = new Vec2();
      this.touches[i].magnitude = new Vec2();
      this.touches[i].position.x = (e.touches[i].pageX - this.local_root.canvas.offset.x) / this.local_root.canvas.scale.x;
      this.touches[i].position.y = (e.touches[i].pageY - this.local_root.canvas.offset.y) / this.local_root.canvas.scale.y;
      this.touches[i].startingPosition = this.touches[i].position.copy();
    }
  }

  handleTouchEnd(e) {
    e.preventDefault();
    let mTouches = e.changedTouches;
    for (let i = 0; i < mTouches.length; ++i) {
      let id = this.getTouchIndexFromId(mTouches[i].identifier);
      this.touches.splice(id, 1);
      this.touchPresses.splice(id, 1);
    }
  }

  handleTouchMove(e) {
    e.preventDefault();
    for (let i = 0; i < this.touches.length; ++i) {
      this.touches[i].change.x = 0;
      this.touches[i].change.y = 0;
      this.touches[i].position.x = (e.touches[i].pageX - this.local_root.canvas.offset.x) / this.local_root.canvas.scale.x;
      this.touches[i].position.y = (e.touches[i].pageY - this.local_root.canvas.offset.y) / this.local_root.canvas.scale.y;
      this.touches[i].magnitude = this.touches[i].position.minus(this.touches[i].startingPosition).dividedBy(this.local_root.canvas.nativeSize).times(this.local_root.canvas.scale);
      if (this.touches[i].previousPosition.x !== 0) {
        this.touches[i].change.x = this.touches[i].position.x - this.touches[i].previousPosition.x;
        this.touches[i].change.y = this.touches[i].position.y - this.touches[i].previousPosition.y;
      }
      this.touches[i].previousPosition.x = (e.touches[i].pageX - this.local_root.canvas.offset.x) / this.local_root.canvas.scale.x;
      this.touches[i].previousPosition.y = (e.touches[i].pageY - this.local_root.canvas.offset.y) / this.local_root.canvas.scale.y;
    }
  }

  /*------UTILITY------*/
  getTouchIndexFromId(id) {
    for (let i = 0; i < this.touches.length; ++i) {
      if (this.touches[i].identifier === id) {
        return i;
      }
      else {
        return -1;
      }
    }
  }

  /*------POINT INTERSECTION DETECTION------*/
  containsTouch(shape) {
    for (let i = 0; i < this.touches.length; ++i) {
      if (shape.contains(new Vec2(this.touches[i].position.x, this.touches[i].position.y))) {
        return this.touches[i];
      }
    }
    return null;
  }

  containsTouchPress(shape) {
    for (let i = 0; i < this.touches.length; ++i) {
      if (shape.contains(new Vec2(this.touches[i].position.x, this.touches[i].position.y))) {
        if (this.touchPresses[i] === true) {
          return this.touches[i];
        }
      }
    }
    return null;
  }
}