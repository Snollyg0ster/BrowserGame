import { BattleFieldProps } from './gameComponents/models';
import Battlefield from './gameComponents/battlefield';
import GameInput from './gameComponents/input';
import SpaceShip from './gameComponents/ship';
import game from './gameConfigs';
import shipImage from './assets/img/ship5.png';
import Score from './gameComponents/score';
import HeartHealth from './gameComponents/heartHealth';
import { GameContext, GameListeners } from './models';
import Background from './gameComponents/background';
import { clearCanvas, Listeners } from './utils';

const gameLevels: BattleFieldProps['atackPeriods'] = [[1, 5], [10, 15], [20]];

//the speed in components is equal to the number of pixels per second

class Game extends Listeners<GameListeners> {
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
  private delay = 0;
  private startPauseTime = 0;
  private paused = false;
  private gamePaused = false;

  constructor(private ctx: GameContext) {
    super();
    
    Object.values(ctx).forEach(clearCanvas)
    this.delay = performance.now();

    this.battlefield = new Battlefield(this, ctx, ...this.gsize, {
      atackPeriods: gameLevels,
    });
    this.ship = new SpaceShip(...this.gsize, 52, 65, this.battlefield);
    this.health = new HeartHealth();
    this.background = new Background(ctx.background, ...this.gsize);

    this.ship.addImage(shipImage);
    this.battlefield.addScore(this.score);
    this.battlefield.addHealth(this.health);
    this.battlefield.addShip(this.ship);

    this.pressed = this.input.getPressed();
    this.input.addAliasClickListener("pause", () => {
      this.paused = !this.paused;
      // this.runListeners("onPaused", this.paused);
    })
    this.input.addAliasClickListener("restart", () => this.runListeners("onRestart"))

    this.gameLoop(0);
  }

  private gameLoop (time: number) {
    this.pressed = this.input.getPressed();
    if (!this.paused) {
      if (this.gamePaused) {
        this.delay += time - this.startPauseTime;
        this.gamePaused = false;
        this.runListeners("onPaused", false);
      }
      const gameTime = time - this.delay;
      this.gameIteration(gameTime, time - this.prevTime);
    } else {
      if (!this.gamePaused) {
        this.startPauseTime = time;
        this.gamePaused = true;
        this.runListeners("onPaused", true);
      }
    }
    this.prevTime = time;
    this.running && window.requestAnimationFrame(this.gameLoop.bind(this));
  };

  getSettings() {
    return { setInvincible: this.ship.setInvincible.bind(this.ship) };
  }

  gameIteration = (time: number, deltaTime: number) => {
    this.ctx.game?.clearRect(0, 0, ...this.gsize);

    this.pressed.right && this.ship.right(deltaTime);
    this.pressed.left && this.ship.left(deltaTime);
    this.pressed.up && this.ship.up(deltaTime);
    this.pressed.down && this.ship.down(deltaTime);
    this.pressed.shootKey && this.ship.shoot(time);

    this.background.draw(time, deltaTime);
    this.battlefield.update(time, deltaTime);
    this.ship.draw(this.ctx.game);
  };

  stop() {
    this.running = false;
    this.input.stopListening();
  }

  togglePause(pause?: boolean) {
    const isPaused = pause === undefined ? !this.paused : pause;
    this.paused = isPaused;
  }
}

export default Game;
