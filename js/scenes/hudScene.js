export default class HudScene extends Phaser.Scene {
  constructor() {
    super('HudScene');
  }

  create() {
    console.log('HudScene');


    const x = this.scale.width;
    const y = this.scale.height;

    this.add.rectangle(0, 0, x, 80, 0x773421);
    this.add.rectangle(0, 0, x, 70, 0xA56243);

    this.gameTitle = this.add.text(10, 10, 'The game seed Project', {
      font: "16px monospace",
      align: 'left',
      color: '#FFF',
      fixedWidth: 200,
      fixedHeight: 300
    });

    this.coins = this.add.text(x / 2 - 210, 10, '0', {
      font: "16px monospace",
      align: 'right',
      color: '#FFF',
      fixedWidth: 200,
      fixedHeight: 300
    });

    this.scene.bringToTop();
  }

  update() {
  }
} 