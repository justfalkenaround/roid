'use strict';

/*------HEADS UP DISPLAY CLASS------*/
class HUD extends Interface {
  constructor(id) {
    super(id);
    this.visualizeBoxes = false;
  }

  /*------OPTIMIZE------*/
  initialize() {
    this.local_root = this.root;
    this.canvas_2 = this.local_root.canvas.canvas_2;
    this.ctx = this.canvas_2.getContext('2d');
    super.initialize();
  }

  /*------CONDUCT 2D DRAWING OPERATIONS------*/
  render() {
    this.clear();
    this.sights();
    this.dash();
    this.dashData();
    this.over();
    if (this.visualizeBoxes) {
      this.visualizeTouchAreas();
    }
    this.introSequence();
  }

  /*------LINE OF FIRE QUE------*/
  sights() {
    this.ctx.strokeStyle = 'rgba(255, 0, 255, 1)';
    this.ctx.beginPath();
    this.ctx.moveTo(this.center.x, this.center.y + 20 * this.scale);
    this.ctx.lineTo(this.center.x + 30 * this.scale, this.center.y + 50 * this.scale);
    this.ctx.moveTo(this.center.x, this.center.y + 20 * this.scale);
    this.ctx.lineTo(this.center.x - 30 * this.scale, this.center.y + 50 * this.scale);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  /*------DASH DISPLAY------*/
  dash() {
    this.ctx.strokeStyle = 'rgba(0, 0, 255, 0.8)';
    this.ctx.fillStyle = 'rgba(255, 0, 255, 0.1)';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.center.y + 190 * this.scale);
    this.ctx.lineTo(this.center.x - 300 * this.scale, this.center.y + 380 * this.scale);
    this.ctx.lineTo(this.center.x + 300 * this.scale, this.center.y + 380 * this.scale);
    this.ctx.lineTo(this.canvas_2.width, this.center.y + 190 * this.scale);
    this.ctx.lineTo(this.canvas_2.width, this.canvas_2.height);
    this.ctx.lineTo(0, this.canvas_2.height);
    this.ctx.lineTo(0, this.center.y + 190 * this.scale);
    this.ctx.moveTo(0, this.center.y + 190 * this.scale);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
  }

  /*------READOUTS------*/
  dashData() {
    this.ctx.save();
    this.ctx.font = `${30 * this.scale}px Courier New`;
    this.ctx.fillStyle = 'rgba(200, 200, 255, 1)';
    this.ctx.fillText(`POSITION: ${this.local_root.camera.position.x.toFixed(3)}, ${this.local_root.camera.position.y.toFixed(3)}, ${(-this.local_root.camera.position.z).toFixed(3)}`, 20 * this.scale, this.canvas_2.height - 20 * this.scale);
    this.ctx.fillText(`VELOCITY: ${this.local_root.camera.velocity.x.toFixed(3)}, ${this.local_root.camera.velocity.y.toFixed(3)}, ${(-this.local_root.camera.velocity.z).toFixed(3)}`, 20 * this.scale, this.canvas_2.height - 60 * this.scale);
    this.ctx.fillText(`SPIN: ${(this.local_root.camera.rotations.x * 100).toFixed(3)}, ${(this.local_root.camera.rotations.y * 100).toFixed(3)}, ${(this.local_root.camera.rotations.z * 100).toFixed(3)}`, 20 * this.scale, this.canvas_2.height - 100 * this.scale);
    this.ctx.fillText(`VECTOR: ${(this.local_root.camera.normal.x).toFixed(3)}, ${(this.local_root.camera.normal.y).toFixed(3)}, ${(this.local_root.camera.normal.z).toFixed(3)}`, 20 * this.scale, this.canvas_2.height - 140 * this.scale);
    if (this.parent.magazine < 30) {
      this.ctx.fillStyle = 'rgba(200, 200, 255, 1)';
    }
    else if (this.parent.magazine < 80) {
      this.ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
    }
    this.ctx.fillText(`MAGAZINE: ${this.parent.magazine}`, 20 * this.scale, this.canvas_2.height - 180 * this.scale);
    this.ctx.fillStyle = 'rgba(200, 200, 255, 1)';
    if (this.parent.fuel < 2500) {
      this.ctx.fillStyle = 'rgba(200, 200, 255, 1)';
    }
    else if (this.parent.fuel < 5000) {
      this.ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
    }
    this.ctx.fillText(`FUEL: ${this.parent.fuel.toFixed(1)}`, 20 * this.scale, this.canvas_2.height - 220 * this.scale);
    this.ctx.fillStyle = 'rgba(200, 200, 255, 1)';
    if (this.parent.controls.speed > 1.0) {
      this.ctx.fillStyle = 'rgba(200, 200, 255, 1)';
    }
    else if (this.parent.controls.speed > 0.5) {
      this.ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
    }
    this.ctx.fillText(`THRUST: ${this.parent.controls.speed.toFixed(2)}`, 20 * this.scale, this.canvas_2.height - 260 * this.scale);
    this.ctx.fillStyle = 'rgba(200, 200, 255, 1)';
    if (this.parent.proximityAlarm) {
      this.ctx.fillStyle = 'rgba(255, 150, 0, 0.9)';
      this.ctx.font = `${70 * this.scale}px Courier New`;
      this.ctx.fillText(`PROXIMITY ALERT ${this.parent.proxDistance.toFixed(2)}`, 800 * this.scale, this.canvas_2.height - 100 * this.scale);
      this.ctx.fillStyle = 'rgba(200, 200, 255, 1)';
      this.ctx.font = `${30 * this.scale}px Courier New`;
    }
    this.ctx.direction = 'rtl';
    this.ctx.fillText(`ARTIFACTS: ${this.parent.hits}`, this.canvas_2.width + -20 * this.scale, this.canvas_2.height - 60 * this.scale);
    this.ctx.fillText(`TIME ELAPSED: ${(this.local_root.timeStamp / 1000).toFixed(2)}`, this.canvas_2.width + -20 * this.scale, this.canvas_2.height - 20 * this.scale);
    this.ctx.direction = 'ltr';
    this.ctx.restore();
  }

  /*------INTRO TEXT------*/
  introSequence() {
    if (this.parent.introTimer > 1200) {
      this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
      this.ctx.font = `${70 * this.scale}px Courier New`;
      this.ctx.fillText(`THERE IS EVIDENCE OF ALIEN LIFE IN THIS ASTEROID FIELD`, 50 * this.scale, 200 * this.scale);
    }
    else if (this.parent.introTimer > 900) {
      this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
      this.ctx.font = `${70 * this.scale}px Courier New`;
      this.ctx.fillText(`IF NEWS GETS OUT IT COULD DESTABALIZE THE WHOLE SYSTEM`, 50 * this.scale, 200 * this.scale);
    }
    else if (this.parent.introTimer > 600) {
      this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
      this.ctx.font = `${70 * this.scale}px Courier New`;
      this.ctx.fillText(`DESTROY THE ALIEN ARTIFACTS AND YOU WILL BE MADE RICH`, 50 * this.scale, 200 * this.scale);
    }
  }

  /*------GAME OVER TEXT------*/
  over() {
    if (!this.parent.death) {
      return;
    }
    this.ctx.save();
    this.ctx.font = `${230 * this.scale}px Courier New`;
    this.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
    this.ctx.fillText(`GAME OVER!`, this.center.x - 700 * this.scale, this.center.y - 300 * this.scale);
    this.ctx.font = `${80 * this.scale}px Courier New`;
    this.ctx.fillText(this.parent.deathMessage, this.center.x - 700 * this.scale, this.center.y - 200 * this.scale);
    this.ctx.font = `${80 * this.scale}px Courier New`;
    this.ctx.fillStyle = 'rgba(0, 255, 0, 1)';
    this.ctx.fillText(`YOU DESTROYED ${this.parent.hits} ARTIFACTS.`, this.center.x - 700 * this.scale, this.center.y - 100 * this.scale);
    this.ctx.fillText(`IN ${this.parent.TOD} SECONDS.`, this.center.x - 700 * this.scale, this.center.y);
    this.ctx.fillStyle = 'rgba(0, 100, 255, 1)';
    if (this.parent.newHighScore) {
      this.ctx.fillText(`CONGRATS! NEW HIGH SCORE!`, this.center.x - 700 * this.scale, this.center.y + 100 * this.scale);
    }
    else {
      this.ctx.fillText(`CURRENT HIGH SCORE:`, this.center.x - 700 * this.scale, this.center.y + 100 * this.scale);
      this.ctx.fillText(`ARTIFACTS: ${this.parent.currentHighScore.hits} TIME: ${this.parent.currentHighScore.time}`, this.center.x - 700 * this.scale, this.center.y + 200 * this.scale);
    }
    if (this.parent.readyReset) {
      this.ctx.font = `${120 * this.scale}px Courier New`;
      this.ctx.fillStyle = 'rgba(200, 200, 255, 1)';
      this.ctx.fillText(`FIRE TO RESET`, this.center.x - 480 * this.scale, this.center.y + 560 * this.scale);
    }
    this.ctx.restore();
  }

  /*------SHOW TOUCH AREAS------*/
  visualizeTouchAreas() {
    const boxes = this.local_root.find('CONTROLS').boxes;
    for (let i = 0; i < boxes.length; i++) {
      this.visualizeRect(boxes[i]);
    }
  }

  visualizeRect(rect) {
    this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.8)';
    this.ctx.strokeRect(rect.position.x, rect.position.y, rect.size.x, rect.size.y);
  }

  /*------UTILITIES------*/
  clear() {
    this.ctx.clearRect(0, 0, this.canvas_2.width, this.canvas_2.height);
  }

  get center() {
    return new Vec2(this.canvas_2.width / 2, this.canvas_2.height / 2);
  }

  get scale() {
    return this.local_root.canvas.scale.x;
  }
}