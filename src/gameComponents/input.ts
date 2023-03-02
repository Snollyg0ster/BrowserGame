import { Listeners } from './../utils';
class Input extends Listeners<Record<string, () => void>> {
  private pressed: Record<string, boolean> = {};
  private clickNum: Record<string, number> = {};
  private listenersRemover: () => void;

  constructor() {
    super();

    const onKeyDown = this.onKeyDown.bind(this);
    const onKeyUp = this.onKeyUp.bind(this);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    this.listenersRemover = () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }

  private onKeyDown(key: string | KeyboardEvent) {
    const code = typeof key === 'string' ? key : key.code;
    this.pressed[code] = true;
  }

  private onKeyUp(key: string | KeyboardEvent) {
    const code = typeof key === 'string' ? key : key.code;
    delete this.pressed[code];
    code in this.clickNum ? this.clickNum[code]++ : (this.clickNum[code] = 1);
    this.runListeners(code);
  }

  protected getClickNum(keys: string[]) {
    return keys.reduce((num, key) => num + (this.clickNum[key] || 0), 0);
  }

  protected isPressed(keys: string[]) {
    return keys.some((key) => this.pressed[key]);
  }

  syntheticPress(code: string) {
    this.onKeyDown(code);
    this.onKeyUp(code);
  }

  stopListening() {
    this.listenersRemover();
  }
}

class GameInput extends Input {
  private aliases = {
    left: ['KeyA', 'ArrowLeft'],
    right: ['KeyD', 'ArrowRight'],
    up: ['KeyW', 'ArrowUp'],
    down: ['KeyS', 'ArrowDown'],
    pause: ['KeyP', 'Escape'],
    shootKey: ['Space'],
    restart: ['KeyR'],
  };

  constructor() {
    super();
  }

  addAliasClickListener(
    alias: keyof typeof this.aliases,
    listener: () => void
  ) {
    this.aliases[alias].forEach((key) => this.addListener(key, listener));
  }

  getPressed() {
    return Object.entries(this.aliases).reduce(
      (aliases, [alias, keys]) => ({
        ...aliases,
        [alias]: this.isPressed(keys),
      }),
      {}
    ) as Record<keyof typeof this.aliases, boolean>;
  }
}

export default GameInput;
