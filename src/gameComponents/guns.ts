import { GunProps, ShootProps, Color } from './models';
import Battlefield from './battlefield';
import Bullet from './bullet';
import { randomRgbaString } from './utils';

class Gun {
  type: string = 'gun';
  protected lastShot = 0;
  protected color: Color = undefined;
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

  setColor(color: Color) {
    this.color = color;
    return this;
  }

  fire(x: number, y: number, options?: ShootProps) {
    const { speed = this.defaultSpeed, elevate = true } = options || {};
    const bulletSpeed = this.configSpeed || speed;
    const color = this.color || randomRgbaString(150, 150);
    const bullet = new Bullet(
      this.battlefield.gSize.height,
      x + this.width / 2,
      y,
      bulletSpeed,
      {
        color: color!,
        enemy: this.enemy,
      }
    );
    elevate && bullet.upToSelfHeight();
    this.battlefield.addBullet(bullet);
  }

  shoot(time: number, x: number, y: number, options?: ShootProps) {
    if (!this.lastShot || (time - this.lastShot) / 1000 >= this.rechargeSpeed)
      this.lastShot = time;
    else return;

    this.fire(x, y, options);

    return 1;
  }
}

export class DoubleGun extends Gun {
  type: string = 'doubleGun';

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

  fire(x1: number, y: number, options?: ShootProps) {
    const { speed = this.defaultSpeed } = options || {};
    const bulletSpeed = this.configSpeed || speed;
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
  }
}

export default Gun;
