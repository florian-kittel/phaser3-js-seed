import Actor from '../actors/actor.js';
import PlayerAnimations from '../actors/player-animations.js';

export default class LevelScene extends Phaser.Scene {
  constructor() {
    super('LevelScene');
  }

  create() {
    console.log('LevelScene');
    let clickedPlayer = false;

    this.initMap();
    this.initPathFinding();

    const cam = this.cameras.main;
    cam.setSize(window.innerWidth, window.innerHeight);
    cam.setBounds(0, 0, 640, 480);
    cam.setZoom(2);

    this.matter.world.setBounds(0, 0, 640, 480, 16, true, true, true, true);

    this.groundLayer.setInteractive();
    this.groundLayer.on('pointerdown', () => {
      // this.activatePlayer(undefined);
    })

    this.input.mouse.disableContextMenu();

    this.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => {
      if (pointer.rightButtonDown()) {

        this.activatePlayer(undefined);
        return;
      }


      if (clickedPlayer || !this.activePlayer) {
        return;
      }

      const { worldX, worldY } = pointer;
      this.activePlayer.onMoveTo(worldX, worldY);
    });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off(Phaser.Input.Events.POINTER_UP)
    });

    this.playerAnimations = new PlayerAnimations(this, 'actor');

    this.players = [
      new Actor(this, 160, 130, 'actor'),
      new Actor(this, 240, 110, 'actor'),
      new Actor(this, 200, 140, 'actor'),
    ];

    this.players.forEach(player => {
      player.setInteractive();
      player.on('pointerdown', () => {
        this.activatePlayer(player);
        clickedPlayer = true;

        setTimeout(() => {
          clickedPlayer = false;
        }, 100)
      })
    });

    this.activePlayer = undefined;

    this.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });


    this.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      if (bodyA.label === 'actorCollider' && bodyB.label === 'actorCollider') {
        // console.log('actorCollider')
        bodyA.gameObject.onTargetToMoveBlocked(200);
        bodyB.gameObject.onTargetToMoveBlocked(1000);
      }
    });

    this.input.on("pointermove", function (p) {
      if (!p.isDown) return;

      cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom;
      cam.scrollY -= (p.y - p.prevPosition.y) / cam.zoom;
    });
  }

  update() {
    this.players.forEach(player => {
      player.update();
    })
  }

  createLayer(name, tileset) {
    this[name + 'Layer'] = this.map.createLayer(name, tileset, 0, 20);
  }

  initMap() {
    this.map = this.make.tilemap({ key: 'map', tileWidth: 16, tileHeight: 16 });

    this.tileset = this.map.addTilesetImage('tileset');
    this.tileset2 = this.map.addTilesetImage('tileset2');
    this.water = this.map.addTilesetImage('water');
    this.mountains = this.map.addTilesetImage('mountains');
    // this.collision = this.map.addTilesetImage('collision');

    this.createLayer('water', this.water);
    this.createLayer('ground', this.tileset);
    this.createLayer('river', this.tileset);
    this.createLayer('ground2', this.tileset);
    this.createLayer('roads', this.tileset);
    this.createLayer('mountains', this.mountains);
    this.createLayer('places', this.tileset);
    this.createLayer('businesses', this.tileset2);
    this.createLayer('resources', this.tileset2);
    this.createLayer('collision', this.collision);

    this.collisionLayer.setCollisionByProperty({ collision: true });
    this.matter.world.convertTilemapLayer(this.collisionLayer);
  }

  initPathFinding() {
    this.finder = new EasyStar.js();
    var grid = [];

    const collisions = this.map.layers.find(entry => entry.name === 'collision');
    collisions.data.forEach(row => {
      grid.push(row.map(entry => entry.index));
    });

    this.finder.setGrid(grid);
    // this.finder.enableDiagonals();
    this.finder.setAcceptableTiles([-1]);
  }

  activatePlayer(player) {
    if (this.activePlayer) {
      this.activePlayer.onUnselect();
    }

    this.activePlayer = player;

    if (player) {
      this.activePlayer.onSelect();
    }
  }
} 