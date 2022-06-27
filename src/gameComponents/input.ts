class GameInput {
  private left = ['KeyA', 'ArrowLeft'];
  private right = ['KeyD', 'ArrowRight'];
  private up = ['KeyW', 'ArrowUp'];
  private down = ['KeyS', 'ArrowDown'];
  private stop = 'KeyP';
  private shootKey = 'Space';
  private pressed: Record<string, boolean> = {};
  private clickNum: Record<string, number> = {};

  constructor() {
    document.addEventListener('keydown', (key) => {
      this.pressed[key.code] = true
    });
    document.addEventListener('keyup', (key) => {
      delete this.pressed[key.code]
      key.code in this.clickNum ? this.clickNum[key.code]++ : (this.clickNum[key.code] = 1);
    });
  }

  getPressed() {
    return {
      right: this.right.some(key => this.pressed[key]),
      left: this.left.some(key => this.pressed[key]),
      up: this.up.some(key => this.pressed[key]),
      down: this.down.some(key => this.pressed[key]),
      shootKey: this.pressed[this.shootKey],
      pause: this.clickNum[this.stop] && !!(this.clickNum[this.stop] % 2),
    }
  }
}

export default GameInput;