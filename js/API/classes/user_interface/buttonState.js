"use strict";

/*------SIMPLE DOWN/PRESSED BUTTON STATE CLASS------*/
class ButtonState extends Interface {
  constructor(id = 'ANON-BUTTON-STATE') {
    super(id);
    this.down = false;
    this.pressed = false;
  }
}