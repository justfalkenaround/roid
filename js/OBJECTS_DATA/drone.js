'use strict';

/*------DRONE GEOMETRY CLASS------*/
class Drone extends Cube {
  constructor(id = 'ANON-DRONE') {
    super(id);
    this.hit = false;
    this.colored = false;
    this.counter = 0;
    this.collisionCounter = 0;
    this.fireDivider = Math.floor(Math.random() * 40) + 40;
    this.fireDirection = new Vec3();
  }

  /*------OPTIMIZE------*/
  intitialize() {
    this.local_root = this.root;
    super.intitialize();
  }

  /*------COLLISION DETECTION------*/
  update() {
    this.checkHit();
    this.collisionCounter--;
    if (this.collisionCounter % this.fireDivider === 0) {
      if (this.position.distance(this.local_root.camera.position) < 1200) {
        this.attack();
      }
    }
    super.update();
  }

  /*------ENGAGE WITH PLAYER------*/
  attack() {
    this.aim();
    this.fire();
  }

  /*------DETERMINE FIRE DIRECTION------*/
  aim() {
    this.fireDirection = this.position.minus(this.local_root.camera.position);
    this.fireDirection.normalize();
  }

  /*------CREATE/INITIALIZE PROJECTILE AND FIRE------*/
  fire() {
    const projectile = new Projectile(this.rotation.copy(), `ENEMY_PROJECTILE${this.parent.parent.projectileCount}`);
    this.parent.parent.projectileCount++;
    projectile.color = [1, 1, 1, 1];
    projectile.position = this.position.copy();
    projectile.velocity = this.fireDirection.times(-25);
    projectile.rotation = this.rotation.minus(this.fireDirection);
    projectile.alternate = true;
    projectile.scale = new Vec3(3.8, 3.8, 3.8)
    this.parent.add(projectile);
    projectile.initialize();
  }

  /*------HANDLE IMPACTS------*/
  checkHit() {
    if (this.hit) {
      if (!this.colored) {
        this.color = [1, 1, 1, 1];
      }
      this.counter++;
      this.scale.add(0.5);
      if (this.counter > 8) {
        this.explode();
      }
    }
  }

  /*------PRETTY SELF EXPLANATORY------*/
  explode() {
    this.depracated = true;
    const explosion = new Stars(2500, 15, 3);
    explosion.position = this.relativePosition.copy();
    explosion.color = [1, 0, 0, 1];
    explosion.velocity = this.relativeVelocity.copy();
    explosion.scale = new Vec3(0.01, 0.01, 0.01);
    explosion.scaleFactor = new Vec3(0.15 * Math.random(), 0.15 * Math.random(), 0.15 * Math.random());
    this.parent.add(explosion);
    explosion.initialize();
    this.parent.parent.hits++;
  }

  /*------GET RADIUS BASED ON DISTANCE FROM OBJECT ORIGIN TO A CORNER------*/
  get radius() {
    const v = 0.346410 * this.scale.x;
    return new Vec3(v, v, v);
  }
}