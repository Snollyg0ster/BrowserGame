class GameInput {
  private left = ['KeyA', 'ArrowLeft'];
  private right = ['KeyD', 'ArrowRight'];
  private up = ['KeyW', 'ArrowUp'];
  private down = ['KeyS', 'ArrowDown'];
  private shootKey = 'Space';
  private pressed: Record<string, boolean> = {};

  constructor() {
    document.addEventListener('keydown', (key) => {
      this.pressed[key.code] = true
    });
    document.addEventListener('keyup', (key) => {
      delete this.pressed[key.code]
    });
  }

  getPressed() {
    return {
      right: this.right.some(key => this.pressed[key]),
      left: this.left.some(key => this.pressed[key]),
      up: this.up.some(key => this.pressed[key]),
      down: this.down.some(key => this.pressed[key]),
      shootKey: this.pressed[this.shootKey]
    }
  }
}

export default GameInput;