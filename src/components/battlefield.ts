import Bullet from "./bullet";
import Invader from "./invader";
import { BattleFieldProps } from "./models";

const secondsFromStart = (start: number, current: number) => Math.round((current - start) / 1000)

class Battlefield {
  private start = 0;
  private gameSec = 0;
  private bullets: Bullet[] = [];
  private invaders: Invader[] = [];
  private atackIntensity = 1;
  private atackPeriods: ([number, number] | [number])[] = []
  private currentPeriod = 0;

  constructor(props?: BattleFieldProps) {
    const { atackIntensity, atackPeriods } = props || {};
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

    // console.log(isAtacked, fromStart)

    const updateBullets = this.bullets.map(bullet => bullet.fly(deltaTime)).filter(Boolean) as Bullet[];
    updateBullets.forEach(bullet => bullet.draw(ctx))
    this.bullets = updateBullets;
  }
}

export default Battlefield;