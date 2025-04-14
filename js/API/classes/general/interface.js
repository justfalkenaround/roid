'use strict';

/*------BASIC INTERFACE OBJECT------*/
class Interface {
  constructor(id) {
    if (!id) {
      this.id = 'ANONYMOUS';
    }
    else {
      this.id = id;
    }
    this.parent = null;
    this.visible = true;
  }

  initialize() {
    this.local_root = this.root;
  }

  update() { }

  render() { }

  handleInput() { }

  reset() { }

  get gl() {
    return GL;
  }

  /*------GET HIGHEST PARENT IN CURRENT TREE------*/
  get root() {
    if (this.parent === null) {
      return this;
    }
    else {
      return this.parent.root;
    }
  }

  /*------GET/SET CURRENT GLOBAL TIMESTAMP------*/
  get timeStamp() {
    if (this.root._timeStamp) {
      return this.root._timeStamp;
    }
    else {
      return null;
    }
  }

  set timeStamp(value) {
    this._timeStamp = value;
  }

  /*------GET/SET AMOUNT OF TIME SINCE PREVIOUS FRAME------*/
  get timeElapsed() {
    if (this.root._timeElapsed) {
      return this.root._timeElapsed;
    }
    else {
      return null;
    }
  }

  set timeElapsed(value) {
    this._timeElapsed = value;
  }

  /*------GET RELATIVE CHANGE IN PASSAGE OF TIME FOR CURRENT FRAME------*/
  get timeVariance() {
    if (this.root._timeElapsed) {
      return (this.root._timeElapsed / 1000) * 60;
    }
    else {
      return 1;
    }
  }

  /*------CONSOLE LOG WITH ID -- WARNING/ERROR OPTION------*/
  log(message = 'NO-INPUT', type = null) {
    if (type === 'WARN') {
      console.warn(`${this.id} WARNS: ${message}`);
    }
    else if (type === 'ERROR') {
      console.error(`${this.id} THROWS ERROR: ${message}`);
    }
    else {
      console.log(`${this.id} SAYS: ${message}`);
    }
  }

  static _log(id = 'ANON', message = 'NO-INPUT', type = null) {
    if (type === 'WARN') {
      console.warn(`${id} WARNS: ${message}`);
    }
    else if (type === 'ERROR') {
      console.error(`${id} THROWS ERROR: ${message}`);
    }
    else {
      console.log(`${id} SAYS: ${message}`);
    }
  }
}