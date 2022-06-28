import { BattleFieldProps } from './gameComponents/models';
import Battlefield from './gameComponents/battlefield';
import GameInput from './gameComponents/input';
import SpaceShip from './gameComponents/ship';
import game from './gameConfigs';
import shipImage from './assets/img/ship.png';
import Score from './gameComponents/score';
import HeartHealth from './gameComponents/heartHealth';
import { GameContext } from './models';
import Background from './gameComponents/background';

const gameLevels: BattleFieldProps['atackPeriods'] = [[2, 7], [12, 15], [18]];

//the speed in components is equal to the number of pixels per second

class Game {
  private gsize = game.size;

  private input = new GameInput();
  private score: Score = new Score(this.gsize[0], 35);
  private battlefield: Battlefield;
  private ship: SpaceShip;
  private health: HeartHealth;
  private background: Background;

  private running = true;
  private prevTime = 0;
  private pressed: ReturnType<GameInput['getPressed']>;
  private paused = false;
  private delay = 0;
  private startPauseTime = 0;

  constructor(private ctx: GameContext) {
    this.battlefield = new Battlefield(ctx, ...this.gsize, {
      atackPeriods: gameLevels,
    });
    this.ship = new SpaceShip(...this.gsize, 50, 63, this.battlefield);
    this.health = new HeartHealth();
    this.background = new Background(ctx.background, ...this.gsize);

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

  getSettings() {
    return { setInvincible: this.ship.setInvincible.bind(this.ship) };
  }

  gameIteration = (time: number, deltaTime: number) => {
    this.ctx.game?.clearRect(0, 0, ...this.gsize);

    this.pressed.right && this.ship.right(deltaTime);
    this.pressed.left && this.ship.left(deltaTime);
    this.pressed.up && this.ship.up(deltaTime);
    this.pressed.down && this.ship.down(deltaTime);
    this.pressed.shootKey && this.ship.shoot();

    this.background.draw(time, deltaTime);
    this.battlefield.update(time, deltaTime);
    this.ship.draw(this.ctx.game);
  };

  stop() {
    this.running = false;
    document.removeEventListener('onKeyDown', () => {});
  }
}

export default Game;
