import Bullet from "./bullet";

class Battlefield {
  private bullets: Bullet[] = [];

  addBullet(bullet: Bullet) {
    this.bullets = [...this.bullets, bullet];
  }

  update(ctx: CanvasRenderingContext2D, deltaTime: number) {
    const updateBullets = this.bullets.map(bullet => bullet.fly(deltaTime)).filter(Boolean) as Bullet[];
    updateBullets.forEach(bullet => bullet.draw(ctx))
    this.bullets = updateBullets;
  }
}

export default Battlefield;