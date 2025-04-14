'use strict';

/*------CANVAS CLASS FOR MANAGING HTML5 CANVAS ELEMENT------*/
class Canvas extends Interface {
  constructor(div, canvas, canvas_2, x = 1200, y = 2400, id = 'ANON-CANVAS') {
    super(id);
    this.div = div;
    this.canvas = canvas;
    this.canvas_2 = canvas_2;
    this.canvas_2_ctx = canvas_2.getContext('2d');
    this.nativeSize = new Vec2(x, y);
    this.aspectRatio = this.nativeSize.x / this.nativeSize.y;
    this.context = this.canvas.getContext('webgl2');
  }

  initialize() {
    this.context.enable(this.context.DEPTH_TEST);
    this.gl.clearDepth(1);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LESS);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  /*------CLEAR THE CANVAS------*/
  clear() {
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
  }

  /*------RESIZE THE CANVAS WITHOUT DISTURBING REAL ASPECT RATIO------*/
  resize() {
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;
    let newAspectRatio = newWidth / newHeight;
    if (newAspectRatio > this.aspectRatio) {
      newWidth = newHeight * this.aspectRatio;
    }
    else {
      newHeight = newWidth / this.aspectRatio;
    }
    this.div.style.width = newWidth + 'px';
    this.div.style.height = newHeight + 'px';
    this.div.style.marginTop = (window.innerHeight - newHeight) / 2 + 'px';
    this.div.style.marginLeft = (window.innerWidth - newWidth) / 2 + 'px';
    this.div.style.marginBottom = (window.innerHeight - newHeight) / 2 + 'px';
    this.div.style.marginRight = (window.innerWidth - newWidth) / 2 + 'px';
    this.canvas.width = newWidth;
    this.canvas.height = newHeight;
    this.canvas_2.width = newWidth;
    this.canvas_2.height = newHeight;
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
  }

  /*------GET CURRENT SCALE------*/
  get scale() {
    return new Vec2(this.canvas.width / this.nativeSize.x, this.canvas.height / this.nativeSize.y);
  }

  /*------GET CURRENT OFFSET------*/
  get offset() {
    return new Vec2(Number(this.div.style.marginLeft.replace('px', '')), Number(this.div.style.marginTop.replace('px', '')));
  }
}