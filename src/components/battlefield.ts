import Bullet from "./bullet";
import Invader from "./invader";
import { BattleFieldProps } from "./models";

const secondsFromStart = (start: number, current: number) => Math.round((current - start) / 1000)
const findTopInvader = (invaders: Invader[]) => invaders
  .reduce((topInvader, invader) => invader.position.y - invader.height < topInvader.position.y - topInvader.height ? invader : topInvader)

class Battlefield {
  private start = 0;
  private gameSec = -1;
  private bullets: Bullet[] = [];

  private lastWaweTime = 0;
  private invaders: Invader[] = [];
  private atackChunks: Record<number, Invader[]> = {};
  private chunkWidth = 100;
  private topInvader: Invader | null = null;
  private gapBetweenIvaders = 50;
  private invadersSpeed = 100;
  private invadersHeight = 40;
  private atackIntensity = 1;
  private currentPeriod = 0;
  private atackPeriods: ([number, number] | [number])[] = [];
  private isAtacked = false;

  constructor(private gWidth: number, private gHeight: number, options?: BattleFieldProps) {
    const { atackIntensity, atackPeriods } = options || {};
    atackIntensity && (this.atackIntensity = atackIntensity);
    atackPeriods && (this.atackPeriods = atackPeriods)
  }

  addBullet(bullet: Bullet) {
    this.bullets = [...this.bullets, bullet];
  }

  addInvader(invader: Invader) {
    this.invaders = [...this.invaders, invader]
  }

  addToChunks(invader: Invader) {
    const firtsChunkIndex = ~~(invader.position.x / this.chunkWidth);
    this.atackChunks[firtsChunkIndex]
      ? this.atackChunks[firtsChunkIndex].push(invader)
      : (this.atackChunks[firtsChunkIndex] = [invader]);
    const secondChunkIndex = ~~((invader.position.x + invader.size.width) / this.chunkWidth);
    if (secondChunkIndex !== firtsChunkIndex) {
      this.atackChunks[secondChunkIndex]
        ? this.atackChunks[secondChunkIndex].push(invader)
        : (this.atackChunks[secondChunkIndex] = [invader]);
    }
  }

  chunksGarbageCollector() {
    Promise.resolve().then(() => {
      this.atackChunks = Object.entries(this.atackChunks)
        .reduce((chunks, [key, invaders]) => ({
          ...chunks,
          [key]: invaders.filter(invader => !invader.deleted)
        }), {}) as Battlefield['atackChunks']
    })
  }

  isAtackGoing(time: number) {
    const fromStart = secondsFromStart(this.start, time);
    if (fromStart !== this.gameSec) {
      while (true) {
        if (!this.atackPeriods.length) {
          this.isAtacked = true;
          break;
        }
        const period = this.atackPeriods[this.currentPeriod];
        if (!period || fromStart < period[0]) {
          this.isAtacked = false;
          break;
        };
        if (period[0] <= fromStart && (!period[1] || period[1] >= fromStart)) {
          this.isAtacked = true;
          break;
        }
        else this.currentPeriod += 1;
      }
    }
    return fromStart;
  }

  update(ctx: CanvasRenderingContext2D, time: number, deltaTime: number) {
    const fromStart = this.isAtackGoing(time);

    if (this.isAtacked) {
      const gap = (this.topInvader?.height || this.invadersHeight) + this.gapBetweenIvaders;
      const topInvaderY = this.topInvader?.position.y;
      const isFirstInvaderInPeriod = this.gameSec !== fromStart && fromStart === this.atackPeriods[this.currentPeriod][0];
      this.gameSec = fromStart;
      if (isFirstInvaderInPeriod || topInvaderY && topInvaderY >= gap) {
        const y = isFirstInvaderInPeriod ? 0 : topInvaderY! - gap;
        const newInvader = new Invader(this.gHeight, this.invadersSpeed);
        const x = Math.round(Math.random() * (this.gWidth - newInvader.size.width));
        newInvader.setPosition(x, y);
        this.addInvader(newInvader);
        this.addToChunks(newInvader);
        this.chunksGarbageCollector()
        this.topInvader = findTopInvader(this.invaders);
        this.lastWaweTime = fromStart;
      }
    }

    const updatedBullets = this.bullets.map(bullet => bullet.fly(deltaTime)).filter(Boolean) as Bullet[];
    updatedBullets.forEach(bullet => bullet.draw(ctx))
    this.bullets = updatedBullets;

    const updatedInvaders = this.invaders.map(invader => invader.fly(deltaTime))
      .filter(invader => !invader.deleted) as Invader[];
    updatedInvaders.forEach(invader => invader.draw(ctx))
    this.invaders = updatedInvaders;
  }
}

export default Battlefield;