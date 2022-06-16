import Battlefield from "./battlefield";
import Bullet from "./bullet";

class Tuple {
  bottomPadding: number;
  position: { x: number; y: number; };
  speed = 500;
  rechargeSpeed = 0.2;
  lastShot = 0;

  constructor(
    private gWidth: number,
    private gHeight: number,
    public width: number,
    public height: number,
    private battlefield: Battlefield,
    bottomPadding?: number
  ) {
    this.bottomPadding = bottomPadding || 0;
    this.position = {
      x: gWidth / 2 - width / 2,
      y: gHeight - height - this.bottomPadding,
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  right(deltaTime: number) {
    if (!deltaTime) return
    let newPosition = this.position.x + this.speed / 1000 * deltaTime;
    if (newPosition + this.width > this.gWidth) newPosition = this.gWidth - this.width;
    this.position.x = newPosition
  }

  left(deltaTime: number) {
    if (!deltaTime) return
    let newPosition = this.position.x - this.speed / 1000 * deltaTime;
    if (newPosition < 0) newPosition = 0;
    this.position.x = newPosition;
  }

  shoot() {
    const nowtime = performance.now();
    if ((nowtime - this.lastShot) / 1000 >= this.rechargeSpeed) this.lastShot = nowtime;
    else return;
    const bullet = new Bullet(this.position.x + this.width / 2, this.position.y, 700);
    bullet.upToSelfHeight();
    this.battlefield.addBullet(bullet)
  }
}

export default Tuple;
