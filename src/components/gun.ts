import Battlefield from "./battlefield";
import Bullet from "./bullet";
import { randomRgbaString } from "./utils";

class Gun {
  rechargeSpeed: number = 0.2;
  lastShot = 0;
  defaultSpeed = 1000;

  constructor(private battlefield: Battlefield, rechargeSpeed?: number) {
    if (rechargeSpeed)
      this.rechargeSpeed = rechargeSpeed;
  }

  shoot(x: number, y: number, speed = this.defaultSpeed) {
    const nowtime = performance.now();
    if ((nowtime - this.lastShot) / 1000 >= this.rechargeSpeed) this.lastShot = nowtime;
    else return;

    const color = randomRgbaString(150, 150);
    const bullet = new Bullet(x, y, speed, color!);
    bullet.upToSelfHeight();
    this.battlefield.addBullet(bullet);
  }

  doubleShoot(x1: number, width: number, y: number, speed = this.defaultSpeed) {
    const nowtime = performance.now();
    if ((nowtime - this.lastShot) / 1000 >= this.rechargeSpeed) this.lastShot = nowtime;
    else return;

    const color = randomRgbaString(150, 150);
    const bullet = new Bullet(x1 + width / 4, y, speed, color!);
    const bullet2 = new Bullet(x1 + width * 0.75, y, speed, color!);
    bullet.upToSelfHeight();
    bullet2.upToSelfHeight();
    this.battlefield.addBullet(bullet)
    this.battlefield.addBullet(bullet2)
  }
}

export default Gun;