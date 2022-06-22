import { BattleFieldProps } from './components/models';
import Battlefield from './components/battlefield';
import GameInput from './components/input';
import SpaceShip from './components/ship';
import game from './gameConfigs';
import shipImage from "./assets/img/ship.png";
import Score from './components/score';

const gameLevels: BattleFieldProps['atackPeriods'] = [[2, 7], [10, 15], [18]];

class Game {
  private input = new GameInput();
  private score: Score = new Score(game.size[0], 30);
  private running = true;
  private prevTime = 0;
  private pressed: ReturnType<GameInput['getPressed']>;
  private paused = false;
  private delay = 0;
  private startPauseTime = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    const battlefield = new Battlefield(...game.size, { atackPeriods: gameLevels });
    const ship = new SpaceShip(...game.size, 50, 63, battlefield);
    ship.addImage(shipImage)
    battlefield.addScore(this.score);

    this.pressed = this.input.getPressed();

    const gameLoop = (time: number) => {
      this.pressed = this.input.getPressed();
      if (!this.pressed.pause) {
        if (this.paused) {
          this.delay += time - this.startPauseTime;
          this.paused = false;
        }
        const gameTime = time - this.delay;
        this.gameIteration(ctx, gameTime, time - this.prevTime, ship, battlefield);
      }
      else {
        if (!this.paused) {
          this.startPauseTime = time
          this.paused = true;
        }
      }
      this.prevTime = time;
      this.running && window.requestAnimationFrame(gameLoop);
    };
    gameLoop(0);
  }

  gameIteration = (ctx: CanvasRenderingContext2D, time: number, deltaTime: number, ship: SpaceShip, battlefield: Battlefield) => {
    ctx?.clearRect(0, 0, ...game.size);

    this.pressed.right && ship.right(deltaTime);
    this.pressed.left && ship.left(deltaTime);
    this.pressed.up && ship.up(deltaTime);
    this.pressed.down && ship.down(deltaTime);
    this.pressed.shootKey && ship.shoot();

    battlefield.update(ctx, time, deltaTime);
    ship.draw(ctx);
    this.score.draw(ctx)
  };

  stop() {
    this.running = false;
    document.removeEventListener('onKeyDown', () => { });
  }
};

export default Game;
