export default class HealthBar {

  constructor(scene, x, y) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.width = 10;
    this.height = 4;

    this.x = x - this.width / 2;
    this.y = y - this.height;
    this.value = 100;
    this.p = 76 / 100;



    this.draw();

    scene.add.existing(this.bar);

    return this;
  }

  decrease(amount) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();

    return (this.value === 0);
  }

  show() {
    this.draw();
  }

  hide() {
    this.bar.clear();
  }

  draw() {
    this.bar.clear();

    //  BG
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x, this.y, this.width, this.height);

    //  Health
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);

    if (this.value < 30) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }

    var d = Math.floor(this.p * this.value);

    this.bar.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
  }

}