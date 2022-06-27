import { rectCollision } from './utils';
import Bullet from './bullet';
import Invader from './invader';
import { BattleFieldProps } from './models';
import Score from './score';
import SpaceShip from './ship';
import HeartHealth from './heartHealth';
import { GameContext } from '../models';

const secondsFromStart = (start: number, current: number) =>
  Math.round((current - start) / 1000);
const findTopInvader = (invaders: Invader[]) =>
  invaders.reduce((topInvader, invader) =>
    invader.position.y - invader.height <
    topInvader.position.y - topInvader.height
      ? invader
      : topInvader
  );
const getChunkIndex = (x: number, chunkWidth: number) => ~~(x / chunkWidth);
const isEntityExist = (entity: { hp: number; deleted: boolean }) =>
  !entity.deleted && entity.hp > 0;

class Battlefield {
  private startTime = 0;
  private prevGameSec = -1;
  private gameSec = 0;
  private bullets: Bullet[] = [];

  private invaders: Invader[] = [];
  private atackChunks: Record<number, Invader[]> = {};
  private chunkWidth = 100;
  private topInvader: Invader | null = null;
  private gapBetweenIvaders = 50;
  private invadersSpeed = 70;
  private invadersHeight = 40;
  private atackIntensity = 1;
  private currentPeriod = 0;
  private atackPeriods: ([number, number] | [number])[] = [];
  private isAtacked = false;

  private score: Score | null = null;
  private health: HeartHealth | null = null;
  private ship: SpaceShip | null = null;

  constructor(
    private ctx: GameContext,
    private gWidth: number,
    private gHeight: number,
    options?: BattleFieldProps
  ) {
    const { atackIntensity, atackPeriods } = options || {};
    atackIntensity && (this.atackIntensity = atackIntensity);
    atackPeriods && (this.atackPeriods = atackPeriods);
  }

  get gSize() {
    return { width: this.gWidth, height: this.gHeight };
  }

  addBullet(bullet: Bullet) {
    this.bullets = [...this.bullets, bullet];
  }

  addScore(score: Score) {
    this.score = score;
    this.score?.draw(this.ctx.ui);
  }

  addHealth(health: HeartHealth) {
    this.health = health;
  }

  addShip(ship: SpaceShip) {
    this.ship = ship;
    this.health?.updateHealth(this.ship.health);
    this.health?.draw(this.ctx.ui);
  }

  private addInvader(invader: Invader) {
    this.invaders = [...this.invaders, invader];
  }

  private addToChunks(invader: Invader) {
    const firtsChunkIndex = getChunkIndex(invader.position.x, this.chunkWidth);
    this.atackChunks[firtsChunkIndex]
      ? this.atackChunks[firtsChunkIndex].push(invader)
      : (this.atackChunks[firtsChunkIndex] = [invader]);
    const secondChunkIndex = getChunkIndex(
      invader.position.x + invader.size.width,
      this.chunkWidth
    );
    if (secondChunkIndex !== firtsChunkIndex) {
      this.atackChunks[secondChunkIndex]
        ? this.atackChunks[secondChunkIndex].push(invader)
        : (this.atackChunks[secondChunkIndex] = [invader]);
    }
  }

  private chunksGarbageCollector() {
    Promise.resolve().then(() => {
      this.atackChunks = Object.entries(this.atackChunks).reduce(
        (chunks, [key, invaders]) => ({
          ...chunks,
          [key]: invaders.filter((invader) => isEntityExist(invader)),
        }),
        {}
      ) as Battlefield['atackChunks'];
    });
  }

  private isAtackGoing() {
    const { gameSec, prevGameSec, atackPeriods } = this;
    if (gameSec !== prevGameSec) {
      while (true) {
        if (!atackPeriods.length) {
          this.isAtacked = true;
          break;
        }
        const period = atackPeriods[this.currentPeriod];
        if (!period || gameSec < period[0]) {
          this.isAtacked = false;
          break;
        }
        if (period[0] <= gameSec && (!period[1] || period[1] >= gameSec)) {
          this.isAtacked = true;
          break;
        } else this.currentPeriod += 1;
      }
    }
  }

  private calculateNewInvader() {
    if (!this.isAtacked) return;
    const gap =
      (this.topInvader?.height || this.invadersHeight) + this.gapBetweenIvaders;
    const topInvaderY = this.topInvader?.position.y;
    const isFirstInvaderInPeriod =
      this.prevGameSec !== this.gameSec &&
      this.gameSec === this.atackPeriods[this.currentPeriod][0];
    this.prevGameSec = this.gameSec;
    const isTopInvaderDeleted =
      !this.topInvader || !isEntityExist(this.topInvader);
    if (
      isFirstInvaderInPeriod ||
      (topInvaderY && (topInvaderY >= gap || isTopInvaderDeleted))
    ) {
      const y = isFirstInvaderInPeriod ? 0 : topInvaderY! - gap;
      const newInvader = new Invader(this.gHeight, this.invadersSpeed, this);
      const x = Math.round(
        Math.random() * (this.gWidth - newInvader.size.width)
      );
      newInvader.setPosition(x, y);
      this.addInvader(newInvader);
      this.addToChunks(newInvader);
      this.chunksGarbageCollector();
      this.topInvader = findTopInvader(this.invaders);
    }
  }

  private updateBullets(ctx: CanvasRenderingContext2D, deltaTime: number) {
    const updatedBullets = this.bullets.filter((bullet) => {
      if (bullet.deleted) return false;
      bullet.fly(deltaTime);

      if (bullet.enemy) {
        if (this.ship) {
          const isShipHit = rectCollision(this.ship.rect, bullet.rect);
          if (isShipHit) {
            this.ship.health -= bullet.damage;
            this.health?.updateHealth(this.ship.health);
            this.health?.draw(this.ctx.ui);
            bullet.deleted = true;
            if (this.ship.health <= 0) {
              this.ship.killed = true;
            }
          }
        }
      } else {
        const bulletChunkIndex = getChunkIndex(bullet.rect.x, this.chunkWidth);
        const comingAcrossInvaders = this.atackChunks[bulletChunkIndex];
        comingAcrossInvaders &&
          comingAcrossInvaders.forEach((invader) => {
            if (bullet.enemy || invader.deleted || invader.hp <= 0) {
              return;
            }

            const isInvaderHit = rectCollision(invader.rect, bullet.rect);
            if (!isInvaderHit) return;
            invader.hp -= bullet.damage;
            bullet.deleted = true;
          });
      }

      return true;
    });
    updatedBullets.forEach((bullet) => bullet.draw(ctx));
    this.bullets = updatedBullets;
  }

  private updateInvaders(ctx: CanvasRenderingContext2D, deltaTime: number) {
    const updatedInvaders = this.invaders
      .filter((invader) => {
        if (invader.hp <= 0) {
          this.score?.increaseScore((invader.maxHP / 2) * 1000);
          this.score?.draw(this.ctx.ui);
        }
        return isEntityExist(invader);
      })
      .map((invader) => invader.fly(deltaTime));
    updatedInvaders.forEach((invader) => invader.draw(ctx));
    this.invaders = updatedInvaders;
  }

  update(time: number, deltaTime: number) {
    this.gameSec = secondsFromStart(this.startTime, time);
    this.isAtackGoing();
    this.calculateNewInvader();
    this.updateInvaders(this.ctx.game, deltaTime);
    this.updateBullets(this.ctx.game, deltaTime);
  }
}

export default Battlefield;
