"use strict";

/*------KEYBOARD MANAGER------*/
class Keyboard extends Interface {
  constructor(id = 'ANON-KEYBOARD') {
    super(id);
    this.keyStates = [];
    for (let i = 0; i < 256; ++i) {
      this.keyStates.push(new ButtonState());
    }
  }

  /*------ATTACH LISTENERS------*/
  initialize() {
    this.local_root = this.root;
    document.addEventListener("keydown", (e) => {
      this.handleKeyDown(e);
      if (this.local_root) {
        this.local_root.handleInput(e);
      }
    });
    document.addEventListener("keyup", (e) => {
      this.handleKeyUp(e);
      if (this.local_root) {
        this.local_root.handleInput(e);
      }
    });
  }

  /*------ADJUST BUTTONSTATES------*/
  update() {
    for (let i = 0; i < 256; ++i) {
      this.keyStates[i].pressed = false;
    }
  }

  /*------HANDLERS------*/
  handleKeyDown(e) {
    let code = e.keyCode;
    if (code < 0 || code > 255) {
      return;
    }
    if (!this.keyStates[code].down) {
      this.keyStates[code].pressed = true;
    }
    this.keyStates[code].down = true;
  }

  handleKeyUp(e) {
    this.keyStates[e.keyCode].down = false;
  }
}