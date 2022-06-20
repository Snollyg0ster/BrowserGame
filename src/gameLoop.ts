import { BattleFieldProps } from './components/models';
import Battlefield from './components/battlefield';
import GameInput from './components/input';
import SpaceShip from './components/ship';
import game from './gameConfigs';
import shipImage from "./assets/img/ship.png";

const gameLevels: BattleFieldProps['atackPeriods'] = [[3, 12], [18, 22], [24]];

const gameIteration = (ctx: CanvasRenderingContext2D, deltaTime: number, input: GameInput, ship: SpaceShip, battlefield: Battlefield) => {
  ctx?.clearRect(0, 0, ...game.size);
  const pressed = input.getPressed();

  pressed.right && ship.right(deltaTime);
  pressed.left && ship.left(deltaTime);
  pressed.up && ship.up(deltaTime);
  pressed.down && ship.down(deltaTime);
  pressed.shootKey && ship.shoot();

  battlefield.update(ctx, deltaTime);
  ship.draw(ctx);
};

const drawGame = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  const input = new GameInput();
  let running = true;
  let prevTime = 0;

  if (ctx) {
    const battlefield = new Battlefield(...game.size, { atackPeriods: gameLevels });
    const ship = new SpaceShip(...game.size, 50, 63, battlefield);
    ship.addImage(shipImage)

    const gameLoop = (time: number) => {
      gameIteration(ctx, time - prevTime, input, ship, battlefield);
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
