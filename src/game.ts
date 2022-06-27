import { BattleFieldProps } from './components/models';
import Battlefield from './components/battlefield';
import GameInput from './components/input';
import SpaceShip from './components/ship';
import game from './gameConfigs';
import shipImage from './assets/img/ship.png';
import Score from './components/score';
import HeartHealth from './components/heartHealth';

const gameLevels: BattleFieldProps['atackPeriods'] = [[2, 7], [10, 15], [18]];

class Game {
  private input = new GameInput();
  private score: Score = new Score(game.size[0], 30);
  private battlefield: Battlefield;
  private ship: SpaceShip;
  private health: HeartHealth;
  private running = true;
  private prevTime = 0;
  private pressed: ReturnType<GameInput['getPressed']>;
  private paused = false;
  private delay = 0;
  private startPauseTime = 0;

  constructor(
    private gameContext: CanvasRenderingContext2D,
    private uiContext: CanvasRenderingContext2D,
    private backgroundContext: CanvasRenderingContext2D
  ) {
    this.battlefield = new Battlefield(...game.size, {
      atackPeriods: gameLevels,
    });
    this.ship = new SpaceShip(...game.size, 50, 63, this.battlefield);
    this.health = new HeartHealth();
    this.ship.addImage(shipImage);
    this.battlefield.addScore(this.score);
    this.battlefield.addHealth(this.health);
    this.battlefield.addShip(this.ship);

    this.pressed = this.input.getPressed();

    const gameLoop = (time: number) => {
      this.pressed = this.input.getPressed();
      if (!this.pressed.pause) {
        if (this.paused) {
          this.delay += time - this.startPauseTime;
          this.paused = false;
        }
        const gameTime = time - this.delay;
        this.gameIteration(gameTime, time - this.prevTime);
      } else {
        if (!this.paused) {
          this.startPauseTime = time;
          this.paused = true;
        }
      }
      this.prevTime = time;
      this.running && window.requestAnimationFrame(gameLoop);
    };
    gameLoop(0);
  }

  gameIteration = (time: number, deltaTime: number) => {
    this.gameContext?.clearRect(0, 0, ...game.size);

    this.pressed.right && this.ship.right(deltaTime);
    this.pressed.left && this.ship.left(deltaTime);
    this.pressed.up && this.ship.up(deltaTime);
    this.pressed.down && this.ship.down(deltaTime);
    this.pressed.shootKey && this.ship.shoot();

    this.battlefield.update(this.gameContext, time, deltaTime);
    this.ship.draw(this.gameContext);
    this.score.draw(this.gameContext);
    this.health.draw(this.gameContext);
  };

  stop() {
    this.running = false;
    document.removeEventListener('onKeyDown', () => {});
  }
}

export default Game;
