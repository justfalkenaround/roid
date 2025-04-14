'use strict';

/*------ASTEROID GEOMETRY CLASS------*/
class Asteroid extends Geometry {
  constructor(id) {
    const data = {};
    data.renderingMode = 'TRIANGLES';
    data.vertices = Ball._vertices;
    data.indices = Ball._indices;
    data.shininess = 100000;
    super(data, id);
    this.radius = new Vec3(0.5, 0.5, 0.5);
    this.hit = false;
    this.colored = false;
    this.counter = 0;
    this.collisionCounter = 0;
    this.life = Math.floor(Math.random() * 8);
    this.crashed = false;
  }

  /*------UPDATE VALUES AND CHECK POSITION------*/
  update() {
    if (this.position.x - this.radius.x < -2500 || this.position.x + this.radius.x > 2500) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.position.y - this.radius.y < -2500 || this.position.y + this.radius.y > 2500) {
      this.velocity.y = -this.velocity.y;
    }
    if (this.position.z - this.radius.z < -2500 || this.position.z + this.radius.z > 2500) {
      this.velocity.z = -this.velocity.z;
    }
    this.collisionCounter--;
    this.checkHit();
    super.update();
  }

  /*------COUNT IMPACTS------*/
  checkHit() {
    if (this.hit) {
      if (this.life > 0 && !this.crashed) {
        this.life--;
        this.hit = false;
        return;
      }
      if (!this.colored) {
        this.color = [1, 1, 1, 1];
      }
      this.counter++;
      this.scale.add(0.5);
      if (this.counter > 10) {
        this.explode();
      }
    }
  }

  /*------PRETTY SELF EXPLANATORY------*/
  explode() {
    this.depracated = true;
    const explosion = new Stars(3000, 30, 10);
    explosion.position = this.relativePosition.copy();
    explosion.velocity = this.relativeVelocity.copy();
    explosion.color = [0, 0.5, 1, 1];
    explosion.scale = new Vec3(0.04, 0.04, 0.04);
    explosion.scaleFactor = new Vec3(0.3 * Math.random(), 0.3 * Math.random(), 0.3 * Math.random());
    this.parent.add(explosion);
    explosion.initialize();
  }

  /*------HANDLE IMPACT WITH ANOTHER ASTEROID OR ARTIFACT------*/
  bump() {
    if (this.collisionCounter <= 0) {
      this.collisionCounter = 250;
      this.velocity.multiply(-1);
    }
  }

  /*------GET INACCURATE RADIUS FOR COLLISION DETECTIONS------*/
  get radius() {
    return this._radius.times(this.relativeScale);
  }

  set radius(val) {
    this._radius = val;
  }
}