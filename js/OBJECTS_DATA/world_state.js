'use strict';

/*------MAIN GAME STATE CLASS------*/
class WorldState extends ObjectList {
  constructor(id = 'WORLD-STATE') {
    super(id);
    this.fire = false;
    this.magazine = 100;
    this.fuel = 15000;
    this.proximityAlarm = false;
    this.death = false;
    this.died = false;
    this.deathMessage = 'YOU DIED IN SPACE, BIG SURPRISE';
    this.hits = 0;
    this.iteration = 0;
    this.projectileCount = 0;
    this.enemyProjectileCount = 0;
    this.deathTimer = 0;
    this.introTimer = 1500;
    this.currentHighScore = { hits: 0, time: 0.00 };
    this.newHighScore = false;
    this.alarmCount = 0;
  }

  /*------INITIALIZE ALL OF THE OBJECTS IN THE WORLD------*/
  initialize() {
    this.initializeHighScore();
    this.local_root = this.root;
    this.initializeWorkers();
    this.local_root.camera.position = new Vec3(2600, 2600, 2600);
    this.local_root.camera.rotations = new Vec3(-0.001 * Math.random(), 0.001 * Math.random(), 0.001 * Math.random());
    this.local_root.camera.velocity = new Vec3(-0.2, -0.2, -0.2);
    this.meshes = new ObjectList('MESHES');
    this.add(this.meshes);
    this.controls = new Controls('CONTROLS');
    this.add(this.controls);
    this.parent.switchTo(this);
    this.hairs = new Plane(1, 2, 3, 'HAIRS');
    this.hairs.color = [0, 1, 0, 1];
    this.hairs.scale = new Vec3(0.2, 0.2, 0.2);
    this.meshes.add(this.hairs);
    this.stars = new Stars(10000, 100000, 10000);
    this.stars.rotationVelocity = new Vec3(0.0001, 0.00002, 0.00003);
    this.meshes.add(this.stars);
    this.sol = new Ball('SOL');
    this.sol.color = [1, 1, 0.9, 1];
    this.sol.scale = new Vec3(3000, 3000, 3000);
    this.sol.position = new Vec3(100000, 100000, 100000);
    this.sol.renderingMode = 'LINES';
    this.meshes.add(this.sol);
    this.HUD = new HUD('HUD');
    this.add(this.HUD);
    for (let i = 0; i < 100; i++) {
      let ball = new Ball(`ARTIFACT${i}`);
      ball.color = [Math.random(), Math.random(), Math.random(), 1];
      ball.scale = new Vec3(16, 16, 16);
      ball.position = Utilities.randomClipVector(2200, 25);
      ball.velocity = Utilities.randomClipVector(0.3, 0.13);
      ball.bounding = true;
      this.meshes.add(ball);
    }
    for (let i = 0; i < 250; i++) {
      let roid = new Asteroid(`ASTEROID${i}`);
      let mr = Math.random();
      let rc = mr * 0.20;
      roid.color = [rc, rc, rc, 1];
      roid.scale = new Vec3(200 * mr, 200 * mr, 200 * mr);
      roid.position = Utilities.randomClipVector(2500, 100);
      roid.velocity = Utilities.randomClipVector(0.8, 0.001);
      roid.bounding = true;
      this.meshes.add(roid);
    }
    for (let i = 0; i < 60; i++) {
      const drone = new Drone(`DRONE${i}`);
      drone.scale = new Vec3(20, 20, 20);
      drone.position = Utilities.randomClipVector(1800, 100);
      drone.colorfull();
      drone.bounding = true;
      this.meshes.add(drone);
    }
    super.initialize();
  }

  /*------MANAGE LOCAL STORAGE FOR HIGH SCORE------*/
  initializeHighScore() {
    if (!localStorage.ROID) {
      localStorage.ROID = JSON.stringify(this.currentHighScore);
    }
    else {
      this.currentHighScore = JSON.parse(localStorage.ROID);
    }
  }

  /*------CREATE ALL OF THE WEB WORKERS -- GIVE THEM INSTRUCTIONS------*/
  initializeWorkers() {
    this.asteroidWorker = new Worker(ASTEROID_WORKER);
    this.asteroidWorker.onmessage = (obj) => {
      try {
        for (let i = 0; i < obj.data.length; i++) {
          this.meshes.find(obj.data[i]).bump();
        }
      }
      catch (err) { }

    };
    this.projectileWorker = new Worker(PROJECTILE_WORKER);
    this.projectileWorker.onmessage = (obj) => {
      for (let i = 0; i < obj.data.length; i++) {
        try {
          if (obj.data[i].indexOf('PROJECTILE') >= 0) {
            this.meshes.find(obj.data[i]).depracate();
          }
          else if (obj.data[i].indexOf('ARTIFACT') >= 0) {
            this.meshes.find(obj.data[i]).hit = true;
          }
          else if (obj.data[i].indexOf('DRONE') >= 0) {
            this.meshes.find(obj.data[i]).hit = true;
          }
          else if (obj.data[i].indexOf('ASTEROID') >= 0) {
            this.meshes.find(obj.data[i]).hit = true;
          }
        }
        catch (err) { }
      }
    };
    this.artifactWorker = new Worker(ARTIFACT_WORKER);
    this.artifactWorker.onmessage = (obj) => {
      try {
        for (let i = 0; i < obj.data.length; i++) {
          this.meshes.find(obj.data[i]).bump();
        }
      }
      catch (err) { }
    };
    this.shipWorker = new Worker(SHIP_WORKER);
    this.shipWorker.onmessage = (obj) => {
      try {
        const nearest = obj.data;
        if (!nearest.id) {
          this.proximityAlarm = false;
          return;
        }
        else if (nearest.hit) {
          this.death = true;
          if (nearest.id.indexOf('PROJECTILE') >= 0) {
            this.meshes.find(nearest.id).depracate();
            this.deathMessage = 'YOU WERE HIT BY ENEMY FIRE';
          }
          else if (nearest.id.indexOf('ASTEROID') >= 0) {
            this.meshes.find(nearest.id).hit = true;
            this.meshes.find(nearest.id).crashed = true;
            this.deathMessage = 'YOU CRASHED INTO AN ASTEROID';
          }
          else if (nearest.id.indexOf('ARTIFACT') >= 0) {
            this.meshes.find(nearest.id).hit = true;
            this.deathMessage = 'YOU CRASHED INTO AN ARTIFACT';
          }
        }
        else {
          this.proximityAlarm = true;
          this.proxDistance = nearest.distance;
          if (this.alarmCount < 0 && !this.died) {
            this.local_root.audioManager.playTone([5, 'E'], 0.1, 0, 0.05);
            this.alarmCount = 15;
          }
          this.alarmCount--;
        }
      }
      catch (err) { }
    };
  }
  asteroidCollisions() {
    const positions = [];
    const ids = [];
    const rads = [];
    for (let i = 0; i < this.meshes.objects.length; i++) {
      const obj = this.meshes.objects[i];
      if (obj instanceof Asteroid) {
        positions.push(obj.position.array);
        ids.push(obj.id);
        rads.push(obj.radius.x);
      }
    }
    this.asteroidWorker.postMessage([positions, ids, rads]);
  }
  projectileCollisions() {
    const positions = [];
    const ids = [];
    const rads = [];
    const velocities = [];
    for (let i = 0; i < this.meshes.objects.length; i++) {
      const obj = this.meshes.objects[i];
      if (obj instanceof Asteroid || obj instanceof Ball || obj instanceof Projectile || obj instanceof Drone) {
        positions.push(obj.position.array);
        ids.push(obj.id);
        rads.push(obj.radius.x);
        velocities.push(obj.velocity.array);
      }
    }
    this.projectileWorker.postMessage([positions, ids, rads, velocities]);
  }
  artifactCollisions() {
    const positions = [];
    const ids = [];
    const rads = [];
    for (let i = 0; i < this.meshes.objects.length; i++) {
      const obj = this.meshes.objects[i];
      if (obj instanceof Ball || obj instanceof Asteroid) {
        positions.push(obj.position.array);
        ids.push(obj.id);
        rads.push(obj.radius.x);
      }
    }
    this.artifactWorker.postMessage([positions, ids, rads]);
  }
  shipCollisions() {
    const ship = this.local_root.camera.position.array;
    const positions = [];
    const ids = [];
    const rads = [];
    for (let i = 0; i < this.meshes.objects.length; i++) {
      const obj = this.meshes.objects[i];
      if (obj instanceof Ball || obj instanceof Asteroid || (obj instanceof Projectile && !obj.friendly)) {
        positions.push(obj.position.array);
        ids.push(obj.id);
        rads.push(obj.radius.x);
      }
    }
    this.shipWorker.postMessage([positions, ids, rads, ship]);
  }
  handleInput(e) {
    if (this.died) {
      return;
    }
    super.handleInput(e);
  }

  /*------UPDATE VALUES AND MANAGE WEB WORKERS/RESULTS------*/
  update() {
    if (this.readyReset) {
      if (this.local_root.keyboard.keyStates[32].down
        ||
        this.local_root.mouse.left.down
        ||
        this.local_root.touch.touchDetected && this.local_root.touch.containsTouch(this.controls.boxFire)
        ||
        this.local_root.touch.touchDetected && this.local_root.touch.containsTouch(this.controls.boxMove)
      ) {
        window.location.reload();
      }
    }
    if (this.introTimer > 0) {
      this.introTimer--;
    }
    this.iteration++;
    this.hairs.position = this.local_root.camera.position.copy().minus(this.local_root.camera.normal.times(15));
    this.checkFire();
    this.asteroidCollisions();
    this.projectileCollisions();
    this.artifactCollisions();
    this.shipCollisions();
    this.checkDeath();
    super.update();
  }

  /*------SHIP WEAPONS FIRE HANDLER------*/
  checkFire() {
    if (this.fire && this.magazine > 0) {
      if (!this.local_root.godMode) {
        this.magazine--;
      }
      this.local_root.audioManager.playTrack(this.local_root.assets.PHASER_SOUND, [0, 0.42, 0.2]);
      const projectile = new Projectile(this.local_root.camera.orientation.copy(), `FRIENDLY_PROJECTILE${this.projectileCount}`);
      this.projectileCount++;
      projectile.color = [1, 1, 1, 1];
      projectile.position = this.local_root.camera.position.copy();
      projectile.velocity = this.local_root.camera.normal.copy().times(-20);
      projectile.position.add(this.local_root.camera.up.times(-4));
      projectile.friendly = true;
      this.meshes.add(projectile);
      projectile.initialize();
      this.fire = false;
    }
    let projs = [];
    for (let i = 0, j = this.meshes.objects.length; i < j; i++) {
      const p = this.meshes.objects[i];
      if (p.id.indexOf('FRIENDLY_PROJECTILE') >= 0) {
        projs.unshift(p);
        if (projs.length >= 20) {
          projs[projs.length - 1].depracate();
        }
      }
    }
  }

  /*------CHECK FOR GAME OVER FLAGS------*/
  checkDeath() {
    if (this.fuel <= 0) {
      this.death = true;
      this.deathMessage = 'YOU RAN OUT OF FUEL';
    }
    else if (this.magazine <= 0) {
      this.death = true;
      this.deathMessage = 'YOU RAN OUT OF AMMO';
    }
    if (this.death && !this.died) {
      this.die();
    }
    else if (this.death && !this.readyReset) {
      this.deathTimer++;
      if (this.deathTimer > 250) {
        this.readyReset = true;
      }
    }
  }

  /*------END GAME METHOD -- DISABLE CONTROLS INTERFACE------*/
  die() {
    this.local_root.audioManager.playTrack(this.local_root.assets.ALIEN_SOUND, [0, 84, 2.8]);
    if (this.deathMessage === 'YOU CRASHED INTO AN ARTIFACT') {
      this.hits++;
    }
    this.TOD = (this.local_root.timeStamp / 1000).toFixed(2);
    this.died = true;
    if (this.currentHighScore.hits < this.hits) {
      this.currentHighScore = { hits: this.hits, time: Number(this.TOD) };
      localStorage.ROID = JSON.stringify(this.currentHighScore);
      this.newHighScore = true;
    }
    else if (this.currentHighScore.hits === this.hits) {
      if (this.currentHighScore.time > Number(this.TOD)) {
        this.currentHighScore = { hits: this.hits, time: Number(this.TOD) };
        localStorage.ROID = JSON.stringify(this.currentHighScore);
        this.newHighScore = true;
      }
    }
  }
}