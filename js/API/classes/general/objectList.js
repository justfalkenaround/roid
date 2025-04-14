'use strict';

/*------GENERIC OBJECT LIST------*/
class ObjectList extends Interface {
  constructor(id = 'ANON-OBJECT-LIST') {
    super(id);
    this.objects = [];
  }

  /*------ADD AND ASSIGN PARENT------*/
  add(obj) {
    if (!(obj instanceof Interface)) {
      this.log(`${obj} IS NOT VALID OBJECT TYPE!`, 'ERROR');
      return null;
    }
    obj.parent = this;
    this.objects.push(obj);
    return obj;
  }

  /*------REMOVE ALL CHILDREN------*/
  clear() {
    for (let i = 0, j = this.objects.length; i < j; i++) {
      this.objects[i].parent = null;
    }
    this.objects.splice(0);
  }

  /*------INITIALIZE ALL CHILDREN------*/
  initialize() {
    for (let i = 0, j = this.objects.length; i < j; i++) {
      this.objects[i].initialize();
    }
  }

  /*------UPDATE ALL CHILDREN------*/
  update() {
    for (let i = 0, j = this.objects.length; i < j; i++) {
      if (this.objects[i] && this.objects[i].depracated) {
        this.remove(this.objects[i]);
      }
    }
    for (let i = 0, j = this.objects.length; i < j; i++) {
      this.objects[i].update();
    }
  }

  /*------DRAW ALL CHILDREN------*/
  render() {
    if (!this.visible) {
      return;
    }
    for (let i = 0, j = this.objects.length; i < j; i++) {
      this.objects[i].render();
    }
  }

  /*------HANDLE INPUT FOR ALL CHILDREN------*/
  handleInput(e) {
    for (let i = 0, j = this.objects.length; i < j; i++) {
      this.objects[i].handleInput(e);
    }
  }

  /*------RESET ALL CHILDREN------*/
  reset() {
    for (let i = 0, j = this.objects.length; i < j; i++) {
      this.objects[i].reset();
    }
  }

  /*------REMOVE SPECIFIC OBJECT------*/
  remove(obj) {
    obj.parent = null;
    this.objects.splice(this.objects.indexOf(obj), 1);
  }

  /*------DEPTH FIRST SEARCHING ALGORITHM -- SEARCH BY ID------*/
  find(id) {
    for (let i = 0, j = this.objects.length; i < j; i++) {
      if (this.objects[i].id === id) {
        return this.objects[i];
      }
      if (this.objects[i] instanceof ObjectList) {
        let obj = this.objects[i].find(id);
        if (obj !== null) {
          return obj;
        }
      }
    }
    return null;
  }
}