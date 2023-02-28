class GameInput {
  private left = ['KeyA', 'ArrowLeft'];
  private right = ['KeyD', 'ArrowRight'];
  private up = ['KeyW', 'ArrowUp'];
  private down = ['KeyS', 'ArrowDown'];
  private stop = ['KeyP', 'Escape'];
  private shootKey = ['Space'];
  private pressed: Record<string, boolean> = {};
  private clickNum: Record<string, number> = {};
  stopListening: () => void;

  constructor() {
    const onKeyDown = this.onKeyDown.bind(this);
    const onKeyUp = this.onKeyUp.bind(this);
    
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    this.stopListening = () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    }
  }

  private onKeyDown(key: string | KeyboardEvent) {
    const code = typeof key === "string" ? key : key.code;
    this.pressed[code] = true
  }

  private onKeyUp(key: string | KeyboardEvent) {
    const code = typeof key === "string" ? key : key.code;
    delete this.pressed[code]
    code in this.clickNum ? this.clickNum[code]++ : (this.clickNum[code] = 1);
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

  syntheticPress(code: string) {
    this.onKeyDown(code)
    this.onKeyUp(code)
  }
}

export default GameInput;