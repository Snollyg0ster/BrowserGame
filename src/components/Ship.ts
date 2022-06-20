import Battlefield from "./battlefield";
import Gun from "./gun";

class SpaceShip {
  bottomPadding: number;
  position: { x: number; y: number; };
  speed = 250;
  pitchSpeed = 320;
  gun = new Gun(this.battlefield, 0.1);
  doubleGun = true;
  image = new Image();

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

  addImage(source: string) {
    const image = new Image();
    image.src = source;
    this.image = image;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, 73, 80, this.image.width - 130, this.image.height - 200,
      this.position.x, this.position.y, this.width, this.height);
  }

  right(deltaTime: number) {
    let newPosition = this.position.x + this.pitchSpeed / 1000 * deltaTime;
    if (newPosition + this.width > this.gWidth) newPosition = this.gWidth - this.width;
    this.position.x = newPosition
  }

  left(deltaTime: number) {
    let newPosition = this.position.x - this.pitchSpeed / 1000 * deltaTime;
    if (newPosition < 0) newPosition = 0;
    this.position.x = newPosition;
  }

  up(deltaTime: number) {
    let newPosition = this.position.y - this.speed / 1000 * deltaTime;
    if (newPosition < 0) newPosition = 0;
    this.position.y = newPosition;
  }

  down(deltaTime: number) {
    let newPosition = this.position.y + this.speed / 1000 * deltaTime;
    if (newPosition + this.height > this.gHeight) newPosition = this.gHeight - this.height;
    this.position.y = newPosition;
  }

  shoot() {
    this.doubleGun
      ? this.gun.doubleShoot(this.position.x, this.width, this.position.y)
      : this.gun.shoot(this.position.x + this.width / 2, this.position.y)
    this.doubleGun = !this.doubleGun
  }
}

export default SpaceShip;
