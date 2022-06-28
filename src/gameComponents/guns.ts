import { GunProps, ShootProps } from './models';
import { CSSProperties } from 'react';
import Battlefield from './battlefield';
import Bullet from './bullet';
import { randomRgbaString } from './utils';

class Gun {
  type: string = 'gun';
  protected lastShot = 0;
  protected color: CSSProperties['color'] = undefined;
  protected enemy = false;
  protected configSpeed: number | null = null;
  defaultSpeed = 500;

  constructor(
    protected battlefield: Battlefield,
    protected rechargeSpeed: number,
    protected width: number,
    options?: GunProps
  ) {
    const { enemy, color, configSpeed } = options || {};

    enemy !== undefined && (this.enemy = enemy);
    color && (this.color = color);
    configSpeed && (this.configSpeed = configSpeed);
  }

  setColor(color: CSSProperties['color']) {
    this.color = color;
    return this;
  }

  shoot(x: number, y: number, options?: ShootProps) {
    const { speed = this.defaultSpeed, elevate = true, skip } = options || {};
    const bulletSpeed = this.configSpeed || speed;
    const nowtime = performance.now();
    if (skip) this.lastShot = nowtime;
    if (!skip && (nowtime - this.lastShot) / 1000 >= this.rechargeSpeed)
      this.lastShot = nowtime;
    else return;

    const color = this.color || randomRgbaString(150, 150);
    const bullet = new Bullet(
      this.battlefield.gSize.height,
      x,
      y,
      bulletSpeed,
      {
        color: color!,
        enemy: this.enemy,
      }
    );
    elevate && bullet.upToSelfHeight();
    this.battlefield.addBullet(bullet);
    return 1;
  }
}

export class DoubleGun extends Gun {
  type: string = 'gudoubleGunn';

  constructor(
    battlefield: Battlefield,
    rechargeSpeed: number,
    width: number,
    options?: GunProps
  ) {
    const { enemy, color, configSpeed } = options || {};
    super(battlefield, rechargeSpeed, width);

    enemy !== undefined && (this.enemy = enemy);
    color && (this.color = color);
    configSpeed && (this.configSpeed = configSpeed);
  }

  shoot(x1: number, y: number, options?: ShootProps) {
    const { speed = this.defaultSpeed, skip } = options || {};
    const bulletSpeed = this.configSpeed || speed;
    const nowtime = performance.now();
    if (skip) this.lastShot = nowtime;
    if (!skip && (nowtime - this.lastShot) / 1000 >= this.rechargeSpeed)
      this.lastShot = nowtime;
    else return;

    const color = this.color || randomRgbaString(150, 150);
    const bullet = new Bullet(
      this.battlefield.gSize.height,
      x1 + this.width / 4,
      y,
      bulletSpeed,
      { color: color!, enemy: this.enemy }
    );
    const bullet2 = new Bullet(
      this.battlefield.gSize.height,
      x1 + this.width * 0.75,
      y,
      bulletSpeed,
      { color: color!, enemy: this.enemy }
    );
    bullet.upToSelfHeight();
    bullet2.upToSelfHeight();
    this.battlefield.addBullet(bullet);
    this.battlefield.addBullet(bullet2);
    return 1;
  }
}

export default Gun;
