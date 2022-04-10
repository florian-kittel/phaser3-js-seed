export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.setPath('assets/');

    this.load.atlas('actor', 'actors/actor.png', 'actors/actor-atlas.json');

    this.load.image('water', 'map/water.png');
    this.load.image('mountains', 'map/mountains.png');
    this.load.image('tileset', 'map/tileset.png');
    this.load.image('tileset2', 'map/tileset2.png');
    this.load.image('collision', 'map/collision.png');

    this.load.tilemapTiledJSON('map', 'map/map.json', null, Phaser.Tilemaps.TILED_JSON);
  }

  create() {
    this.scene.start('LevelScene');
    this.scene.start('HudScene');
  }


  update() { }
}