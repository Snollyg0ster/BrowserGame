import { GunQueueItem, ShootProps } from './models';

class MultiGun {
  private queue: GunQueueItem[];
  private lastGunIndex = 0;
  private nextTurnTime = 0;

  constructor(...items: GunQueueItem[]) {
    this.queue = items;
  }

  shoot(time: number, x: number, y: number, options?: ShootProps) {
    const { gun, timeGap } = this.queue[this.lastGunIndex];
    if (time >= this.nextTurnTime) {
      gun.fire(x, y, options);
      this.nextTurnTime = time + timeGap * 1000;
      if (this.lastGunIndex === this.queue.length - 1) {
        this.lastGunIndex = 0;
        return;
      }
      this.lastGunIndex++;
    }
  }
}

export default MultiGun;
