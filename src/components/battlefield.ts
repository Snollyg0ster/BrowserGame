import Bullet from "./bullet";
import Invader from "./invader";
import { BattleFieldProps } from "./models";

const secondsFromStart = (start: number, current: number) => Math.round((current - start) / 1000)

class Battlefield {
  private start = 0;
  private gameSec = 0;
  private bullets: Bullet[] = [];
  private invaders: Invader[] = [];
  private invadersSpeed = 100;
  private invadersHeight = 40;
  private gapBetweenIvaders = this.invadersHeight;
  private atackIntensity = 1;
  private atackPeriods: ([number, number] | [number])[] = []
  private currentPeriod = 0;

  constructor(private gWidth: number, private gHeight: number, options?: BattleFieldProps) {
    const { atackIntensity, atackPeriods } = options || {};
    atackIntensity && (this.atackIntensity = atackIntensity);
    atackPeriods && (this.atackPeriods = atackPeriods)
    this.start = performance.now();
  }

  addBullet(bullet: Bullet) {
    this.bullets = [...this.bullets, bullet];
  }

  addInvader(invader: Invader) {
    this.invaders = [...this.invaders, invader]
  }

  isAtackGoing() {
    const nowtime = performance.now();
    const fromStart = secondsFromStart(this.start, nowtime);
    let isAtackActive = false;
    if (fromStart !== this.gameSec) {
      console.log('fromStart', fromStart)
      this.gameSec = fromStart;
      while (true) {
        if (!this.atackPeriods.length) {
          isAtackActive = true;
          break;
        }
        const period = this.atackPeriods[this.currentPeriod];
        if (!period || fromStart < period[0]) break;
        if (period[0] <= fromStart && (!period[1] || period[1] >= fromStart)) {
          isAtackActive = true;
          break;
        }
        else this.currentPeriod += 1;
      }
    }
    return [isAtackActive, fromStart] as [boolean, number];
  }

  update(ctx: CanvasRenderingContext2D, deltaTime: number) {
    const [isAtacked, fromStart] = this.isAtackGoing();

    if (isAtacked) {
      const interval = Math.ceil((this.invadersHeight + this.gapBetweenIvaders) / this.invadersSpeed);
      const periodStart = this.atackPeriods[this.currentPeriod][0] || 0;
      if ((fromStart - periodStart) / interval) {
        const position = Math.round(Math.random() * this.gWidth)
        this.addInvader(new Invader(this.gHeight, position, 0, this.invadersSpeed))
      }
    }

    // console.log('invaders', this.invaders)
    const updatedBullets = this.bullets.map(bullet => bullet.fly(deltaTime)).filter(Boolean) as Bullet[];
    updatedBullets.forEach(bullet => bullet.draw(ctx))
    this.bullets = updatedBullets;

    const updatedInvaders = this.invaders.map(invader => invader.fly(deltaTime)).filter(Boolean) as Invader[];
    updatedInvaders.forEach(invader => invader.draw(ctx))
    this.invaders = updatedInvaders;
  }
}

export default Battlefield;