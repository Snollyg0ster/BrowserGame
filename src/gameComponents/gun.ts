import { CSSProperties } from 'react';
import Battlefield from './battlefield';
import Bullet from './bullet';
import { randomRgbaString } from './utils';

class Gun {
  rechargeSpeed: number = 0.2;
  private lastShot = 0;
  private defaultSpeed = 500;
  private color: CSSProperties['color'] = undefined;

  constructor(
    private battlefield: Battlefield,
    rechargeSpeed?: number,
    private enemy = false
  ) {
    if (rechargeSpeed) this.rechargeSpeed = rechargeSpeed;
  }

  setColor(color: CSSProperties['color']) {
    this.color = color;
  }

  shoot(x: number, y: number, speed = this.defaultSpeed, elevate = true) {
    const nowtime = performance.now();
    if ((nowtime - this.lastShot) / 1000 >= this.rechargeSpeed)
      this.lastShot = nowtime;
    else return;

    const color = this.color || randomRgbaString(150, 150);
    const bullet = new Bullet(this.battlefield.gSize.height, x, y, speed, {
      color: color!,
      enemy: this.enemy,
    });
    elevate && bullet.upToSelfHeight();
    this.battlefield.addBullet(bullet);
  }

  doubleShoot(x1: number, width: number, y: number, speed = this.defaultSpeed) {
    const nowtime = performance.now();
    if ((nowtime - this.lastShot) / 1000 >= this.rechargeSpeed)
      this.lastShot = nowtime;
    else return;

    const color = this.color || randomRgbaString(150, 150);
    const bullet = new Bullet(
      this.battlefield.gSize.height,
      x1 + width / 4,
      y,
      speed,
      { color: color!, enemy: this.enemy }
    );
    const bullet2 = new Bullet(
      this.battlefield.gSize.height,
      x1 + width * 0.75,
      y,
      speed,
      { color: color!, enemy: this.enemy }
    );
    bullet.upToSelfHeight();
    bullet2.upToSelfHeight();
    this.battlefield.addBullet(bullet);
    this.battlefield.addBullet(bullet2);
  }
}

export default Gun;
