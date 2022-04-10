import HealthBar from './health-bar.js';

export default class Actor extends Phaser.Physics.Matter.Sprite {

  constructor(scene, x, y, texture, frame = 0, scale = 1) {
    super(scene.matter.world, x, y, texture, frame);
    this.scene = scene;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.texture = texture;
    this.isActive = false;
    this.path = [];
    this.pathLastTarget = { x: 0, y: 0 };
    this.pathConfig = {
      fromX: 0,
      toX: 0,
      fromY: 0,
      toY: 0,
      avoid: [
        // { x: 12, y: 9 }
      ],
      lastTarget: {
        x: 0,
        y: 0
      }
    }

    this.internalTimer = setTimeout(() => { });

    this.autoMove = false;
    this.autoMoveTarget = { x: 0, y: 0, dx: 0, dy: 0, xDirection: '', yDirection: '' };

    this.container = this.scene.add.container(x, y);
    this.scene.add.existing(this);

    const hx = 100;

    this.hp = new HealthBar(scene, 0, 0 - 10);
    this.container.add(this.hp.bar);
    this.onUnselect();

    return this.init();
  }

  init() {

    if (this.scale) {
      this.setScale(this.scale, this.scale);
    }

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;

    this.actorCollider = Bodies.rectangle(this.x, this.y, 8, 16, {
      isSensor: false, label: 'actorCollider'
    });

    this.actorSensor = Bodies.circle(this.x, this.y, 32, {
      isSensor: true,
      label: 'actorSensor'
    });

    const compoundBody = Body.create({
      parts: [this.actorCollider, this.actorSensor],
      frictionAir: .1
    });

    this.setExistingBody(compoundBody);
    this.setFixedRotation();

    return this;
  }

  onSelect() {
    this.isActive = true;
    this.hp.show();
    this.container.x = this.x;
    this.container.y = this.y;
  }

  onUnselect() {
    this.isActive = false;
    this.hp.hide();
    this.container.x = this.x;
    this.container.y = this.y;
  }

  onMoveTo(x, y) {
    this.pathConfig.fromX = Math.floor(this.x / 16);
    this.pathConfig.fromY = Math.floor(this.y / 16);
    this.pathConfig.toX = Math.floor(x / 16);
    this.pathConfig.toY = Math.floor(y / 16);

    // console.log('going from (' + this.pathConfig.fromX + ',' + this.pathConfig.fromY + ') to (' + this.pathConfig.toX + ',' + this.pathConfig.toY + ')');

    this.scene.finder.findPath(this.pathConfig.fromX, this.pathConfig.fromY, this.pathConfig.toX, this.pathConfig.toY, (path) => {
      if (path === null) {
        this.path = [];
        console.warn("Path was not found.");
      } else {
        this.path = path;
      }
    });

    this.pathConfig.avoid.forEach(point => this.scene.finder.avoidAdditionalPoint(point.x, point.y));

    this.scene.finder.calculate();
    this.pathConfig.avoid = [];
    this.scene.finder.stopAvoidingAllAdditionalPoints();
  }

  onTargetToMoveBlocked(timer = 0) {
    if (!this.path[0]) {
      return;
    }

    if (this.path[0]) this.pathConfig.avoid.push(this.pathConfig.lastTarget);
    if (this.path[1]) this.pathConfig.avoid.push(this.path[1]);

    this.onStopMove();
    clearTimeout(this.internalTimer);

    this.internalTimer = setTimeout(() => {
      this.onMoveTo(this.pathConfig.toX * 16, this.pathConfig.toY * 16);
    }, timer)
  }

  onStopMove() {
    this.path = [];
  }

  determineMovement() {
    const gridSize = 16;
    const movement = {
      left: false,
      right: false,
      up: false,
      down: false
    }

    if (!this.path || this.path.length <= 0) {
      return movement;
    }

    this.pathConfig.lastTarget = this.path[0];


    const target = this.path[0];
    const x = this.x;
    const y = this.y;
    const tx = (target.x * gridSize) + gridSize / 2;
    const ty = (target.y * gridSize) + gridSize / 2;

    const dx = Math.round(Math.abs(x - tx));
    const dy = Math.round(Math.abs(y - ty));

    if (dx <= 0 && dy <= 0) {
      this.path.shift();
      return this.determineMovement();
    }

    if (x > tx && dx >= 1) {
      movement.left = true;
    }
    else if (x < tx && dx >= 1) {
      movement.right = true;
    }
    else if (y > ty && dy >= 1) {
      movement.up = true;
    }
    else if (y < ty && dy >= 1) {
      movement.down = true;
    }

    return movement;
  }

  update() {
    let walk = false;
    let direction = 'down';
    const speed = .6;

    let movement = {
      left: false,
      right: false,
      up: false,
      down: false
    }

    let playerVelocity = new Phaser.Math.Vector2();
    const keys = this.scene.inputKeys;

    if (this.path[0]) {
      movement = this.determineMovement();
      walk = true;
    }

    if (this.isActive) {
      if (keys.left.isDown) {
        walk = true;
        movement.left = true;
        direction = 'left';
        this.path = [];
      } else if (keys.right.isDown) {
        walk = true;
        movement.right = true;
        direction = 'right';
        this.path = [];
      }

      if (keys.up.isDown) {
        walk = true;
        movement.up = true;
        direction = 'up';
        this.path = [];
      } else if (keys.down.isDown) {
        walk = true;
        movement.down = true;
        direction = 'down';
        this.path = [];
      }
    }


    if (walk) {
      if (movement.left) {
        playerVelocity.x = -1;
        if (!keys.up.isDown && !keys.down.isDown) {
          this.play('left-walk', true);
        }
      } else if (movement.right) {
        playerVelocity.x = 1;
        if (!keys.up.isDown && !keys.down.isDown) {
          this.play('right-walk', true);
        }
      }


      if (movement.up) {
        playerVelocity.y = -1;
        this.play('up-walk', true);
      } else if (movement.down) {
        playerVelocity.y = 1;
        this.play('down-walk', true);
      }
    }

    if (walk) {
      this.container.x = this.x;
      this.container.y = this.y;

    } else {
      this.play('idle', true);
    }

    this.setVelocity(playerVelocity.x, playerVelocity.y);

    playerVelocity.normalize();
    playerVelocity.scale(speed);

  }
}