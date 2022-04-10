export default class PlayerAnimations {
  constructor(scene, texture) {
    this.scene = scene;
    this.texture = texture;

    this.init();
  }

  init() {
    const anims = this.scene.anims;
    const byFrameName = (prefix, start, end) => anims.generateFrameNames(this.texture, { prefix, start, end });
    const forAllDirections = (animation, frameRate = 8, repeat = -1) => {
      ['up', 'down', 'left', 'right'].forEach(direction => {
        const key = direction + '-' + animation;
        const prefix = key + '-';
        anims.create({ key, frames: byFrameName(prefix, 1, 2), frameRate, repeat });
      })
    }

    anims.create({
      key: 'idle',
      frames: byFrameName('down-idle-', 1, 1),
      frameRate: 0,
      repeat: 0,
      repeatDelay: 2000
    });

    forAllDirections('walk');
  }
}