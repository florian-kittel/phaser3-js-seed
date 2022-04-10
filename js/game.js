import MainScene from "./scenes/mainScene.js";
import HudScene from "./scenes/hudScene.js";
import LevelScene from "./scenes/levelScene.js";

const config = {
  width: 640,
  height: 480,
  backgroundColor: '#000',
  type: Phaser.Auto,
  parent: 'game',
  pixelArt: true,
  scene: [
    MainScene, 
    HudScene,
    LevelScene
  ],
  scale: {
    mode: Phaser.Scale.ScaleModes.NONE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  render: {
    antialiasGL: false,
    pixelArt: true,
  },
  canvasStyle: `display: block; width: 100%; height: 100%;`,
  autoFocus: true,
  physics: {
    default: 'matter',
    matter: {
      debug: true,
      gravity: {
        y: 0
      }
    }
  },
  plugins: {
    screen: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision'
      }
    ]
  }
}

new Phaser.Game(config); 