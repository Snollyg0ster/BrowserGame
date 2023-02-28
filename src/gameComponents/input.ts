class GameInput {
  private left = ['KeyA', 'ArrowLeft'];
  private right = ['KeyD', 'ArrowRight'];
  private up = ['KeyW', 'ArrowUp'];
  private down = ['KeyS', 'ArrowDown'];
  private stop = ['KeyP', 'Escape'];
  private shootKey = ['Space'];
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

  private isPressed(keys: string[]) {
    return keys.some(key => this.pressed[key]);
  }

  private getClickNum(keys: string[]) {
    return keys.reduce((num, key) => num + (this.clickNum[key] || 0), 0);
  }

  getPressed() {
    return {
      right: this.isPressed(this.right),
      left: this.isPressed(this.left),
      up: this.isPressed(this.up),
      down: this.isPressed(this.down),
      shootKey: this.isPressed(this.shootKey),
      pause: !!(this.getClickNum(this.stop) % 2),
    }
  }
}

export default GameInput;