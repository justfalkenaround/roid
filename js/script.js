'use strict';

/*----------MAIN SCRIPTS FOR THE SITE----------*/
class Primary {
  constructor(e) {
    this.children = [];
    this.touchEnabled = false;
    this.pageFilter(e);
    this.navigation = new Navigation();
    this.children.push(this.navigation);
    if (this.currentPage === 'ROID') {
      this.roids = new Roids();
      this.children.push(this.roids);
    }
    this.now = 0;
    this.then = 0;
    this.loop(0);
    L('touchstart', (e) => { this.touchDetector(e) });
  }

  /*----------MAIN ANIMATION LOOP - NOT RELATED TO GAMES ----------*/
  loop(time) {
    this.now = time;
    this.children.forEach((child) => {
      if (child.update) {
        child.update(this.now, this.then);
      }
    });
    this.then = time;
    this.frame = window.requestAnimationFrame((time) => { this.loop(time) });
  }

  /*----------LISTEN FOR TOUCH EVENTS AND RECORD THEM----------*/
  touchDetector(e) {
    if (!this.touchEnabled) {
      this.touchEnabled = true;;
      this.navigation.touchEnabled = true;
    }
  }

  /*----------DETERMINE THE CURRENT PAGE----------*/
  pageFilter(e) {
    if (e.srcElement.URL.indexOf('index.html') !== -1) {
      this.currentPage = 'INDEX';
    }
    else if (e.srcElement.URL.indexOf('roid.html') !== -1) {
      this.currentPage = 'ROID';
    }
    else {
      this.currentPage = null;
    }
  }
}

/*----------NAVBAR CLASS----------*/
class Navigation {
  constructor() {
    this.controlsVisible = false;
    this.controlsToggle = Q('.controls-toggle');
    if (this.controlsToggle) {
      this.controlsToggle.addEventListener('click', () => { this.toggleControls() });
    }
    this.desktopControlsModal = Q('.controls-modal-desktop');
    this.mobileControlsModal = Q('.controls-modal-mobile');
    this.desktopControlsModalImg = Q('.controls-modal-desktop img');
    this.mobileControlsModalImg = Q('.controls-modal-mobile img');
    this.logo = Q('.logo');
    this.navItems = document.querySelectorAll('nav a');
    for (let i = 0; i < this.navItems.length; i++) {
      this.navItems[i].addEventListener('touchend', (e) => { this.navItems[i].click() });
    }
    this.initializeSoundToggle();
  }

  /*----------SETUP TOGGLE BUTTON FOR ROID SOUND----------*/
  initializeSoundToggle() {
    this.soundToggle = Q('[data-sound]');
    if (this.soundToggle) {
      this.soundToggle.addEventListener('click', () => {
        if (!eval(this.soundToggle.dataset.sound)) {
          this.soundToggle.setAttribute('data-sound', 'true');
          this.soundToggle.innerText = '🔈';
        }
        else if (eval(this.soundToggle.dataset.sound)) {
          this.soundToggle.setAttribute('data-sound', 'false');
          this.soundToggle.innerText = '🔇';
        }
      });
    }
  }

  /*----------WITCH VISIBILITY OF RESPECIVE CONTROLS MODALS FOR ROID GAME----------*/
  toggleControls() {
    this.resetModals();
    let mod = null;
    let modI = null;
    if (this.touchEnabled) {
      mod = this.mobileControlsModal;
      modI = this.mobileControlsModalImg;
    }
    else {
      mod = this.desktopControlsModal;
      modI = this.desktopControlsModalImg;
    }
    if (!this.controlsVisible) {
      this.controlsToggle.classList.add('active');
      this.controlsVisible = true;
      mod.classList.remove('invis');
      modI.classList.remove('invis');
    }
    else {
      this.controlsToggle.classList.remove('active');
      this.controlsVisible = false;
    }
  }

  /*----------RESET----------*/
  resetModals() {
    this.desktopControlsModal.classList.add('invis');
    this.mobileControlsModal.classList.add('invis');
    this.desktopControlsModalImg.classList.add('invis');
    this.mobileControlsModalImg.classList.add('invis');
  }
}

/*----------ANIMATION CLASS FOR ROID READY SCREEN----------*/
class Roids {
  constructor() {
    this.header = Q('header h1');
    this.canvas = Q('.asteroids');
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.roids = [];
    for (let i = 0; i < 22; i++) {
      this.roids.push(new _Asteroid(this.canvas, this.ctx));
    }
    W('resize', () => { this.resize() });
  }

  /*----------UPDATE LOOP----------*/
  update(now) {
    if (Math.random() > 0.85) {
      this.header.style.color = `hsl(${(now / 6) % 360}, 100%, 70%)`;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.roids.forEach((roid) => { roid.update(now); roid.draw() });
  }

  /*----------DYNAMIC CANVAS----------*/
  resize() {
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
  }
}

/*----------CLASS FOR THE ANIMATED ASTEROIDS ON THE ROID GAME READY SCREEN----------*/
class _Asteroid {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.position = { x: Math.random() * (this.canvas.width + 200) - 200, y: (Math.random() * this.canvas.height + 200) - 200 };
    this.velocity = { x: Math.random(), y: Math.random() };
    this.rotation = 0;
    if (Math.random() > 0.5) {
      this.velocity.x *= -1;
    }
    if (Math.random() > 0.5) {
      this.velocity.y *= -1;
    }
    this.image = new Image();
    this.image.src = `./img/asteroid${Math.floor(Math.random() * 4) + 5}.png`;
  }

  /*----------UPDATE LOOP----------*/
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.x > this.canvas.width + 200 || this.position.x < -200) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.position.y > this.canvas.height + 200 || this.position.y < -200) {
      this.velocity.y = -this.velocity.y;
    }
  }

  /*----------DRAW LOOP----------*/
  draw() {
    this.ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

/*----------SOME UTILITY FUNCTIONS FOR CLARITY OF CODE----------*/
const Q = (q) => { return document.querySelector(q) };
const L = (e, f) => { return document.addEventListener(e, f) };
const W = (e, f) => { return window.addEventListener(e, f) };

/*----------GLOBAL HANDLE----------*/
let PRIMARY;

/*----------ENTRY POINT----------*/
L('DOMContentLoaded', (e) => {
  PRIMARY = new Primary(e);
});