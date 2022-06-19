import Battlefield from './components/battlefield';
import gameInput from './components/input';
import SpaceShip from './components/ship';
import game from './gameConfigs';

const left = ['KeyA', 'ArrowLeft'];
const right = ['KeyD', 'ArrowRight'];
const up = ['KeyW', 'ArrowUp'];
const down = ['KeyS', 'ArrowDown'];
const shootKey = 'Space';
let pressed: Record<string, boolean> = {};
gameInput(([keyDown, keyUp]) => keyDown ? (pressed[keyDown] = true) : (delete pressed[keyUp!]));

const gameIteration = (ctx: CanvasRenderingContext2D, deltaTime: number, ship: SpaceShip, battlefield: Battlefield) => {
  ctx?.clearRect(0, 0, ...game.size);

  right.some(key => pressed[key]) && ship.right(deltaTime);
  left.some(key => pressed[key]) && ship.left(deltaTime);
  up.some(key => pressed[key]) && ship.up(deltaTime);
  down.some(key => pressed[key]) && ship.down(deltaTime);
  pressed[shootKey] && ship.shoot();

  ship.draw(ctx);
  battlefield.update(ctx, deltaTime);
};

const drawGame = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  let running = true;
  let prevTime = 0;

  if (ctx) {
    const battlefield = new Battlefield({ atackPeriods: [[3, 5], [11]] });
    const tuple = new SpaceShip(...game.size, 50, 63, battlefield);

    const gameLoop = (time: number) => {
      gameIteration(ctx, time - prevTime, tuple, battlefield);
      prevTime = time;
      running && window.requestAnimationFrame(gameLoop);
    };
    gameLoop(0);
  }

  const stop = () => {
    running = false;
    document.removeEventListener('onKeyDown', () => { });
  }
  return { stop };
};

export default drawGame;
