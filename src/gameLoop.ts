import Battlefield from './components/battlefield';
import gameInput from './components/input';
import Tuple from './components/tuple';
import game from './gameConfigs';

const left = ['KeyA', 'ArrowLeft'];
const right = ['KeyD', 'ArrowRight'];
const shootKey = 'Space';
let pressed: Record<string, boolean> = {};
gameInput(([keyDown, keyUp]) => keyDown ? (pressed[keyDown] = true) : (delete pressed[keyUp!]));

const gameIteration = (ctx: CanvasRenderingContext2D, deltaTime: number, tuple: Tuple, battlefield: Battlefield) => {
  ctx?.clearRect(0, 0, ...game.size);

  right.some(key => pressed[key]) && tuple.right(deltaTime);
  left.some(key => pressed[key]) && tuple.left(deltaTime);
  pressed[shootKey] && tuple.shoot();

  tuple.draw(ctx);
  battlefield.update(ctx, deltaTime);
};

const drawGame = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  let running = true;
  let prevTime = 0;

  if (ctx) {
    const battlefield = new Battlefield();
    const tuple = new Tuple(...game.size, 50, 50, battlefield);

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
