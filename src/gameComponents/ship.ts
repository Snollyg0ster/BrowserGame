import Battlefield from './battlefield';
import Gun, { DoubleGun } from './guns';

class SpaceShip {
  private x: number;
  public y: number;
  private speed = 250;
  private pitchSpeed = 320;
  private gun: Gun;
  private doubleGun: DoubleGun;
  private isDoubleGun = true;
  private image = new Image();
  private godMode = false;
  private defaultHealth = 9;
  hp = this.defaultHealth;
  killed = false;

  constructor(
    private gWidth: number,
    private gHeight: number,
    public width: number,
    public height: number,
    private battlefield: Battlefield
  ) {
    this.gun = new Gun(this.battlefield, 0.1, this.width);
    this.doubleGun = new DoubleGun(this.battlefield, 0.1, this.width);
    this.x = gWidth / 2 - width / 2;
    this.y = gHeight - height;
  }

  get health() {
    return this.hp;
  }

  set health(hp: number) {
    if (this.godMode) {
      this.hp = this.defaultHealth;
    } else {
      this.hp = hp;
    }
  }

  get rect() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  addImage(source: string) {
    const image = new Image();
    image.src = source;
    this.image = image;
  }

  setInvincible(isGod: boolean) {
    this.godMode = isGod;
    this.hp = this.defaultHealth;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.killed) {
      this.x = this.gWidth;
      this.y = 0;
      return;
    }
    ctx.drawImage(
      this.image,
      73,
      80,
      this.image.width - 130,
      this.image.height - 200,
      ~~this.x,
      ~~this.y,
      this.width,
      this.height
    );
  }

  right(deltaTime: number) {
    let newPosition = this.x + (this.pitchSpeed / 1000) * deltaTime;
    if (newPosition + this.width > this.gWidth)
      newPosition = this.gWidth - this.width;
    this.x = newPosition;
  }

  left(deltaTime: number) {
    let newPosition = this.x - (this.pitchSpeed / 1000) * deltaTime;
    if (newPosition < 0) newPosition = 0;
    this.x = newPosition;
  }

  up(deltaTime: number) {
    let newPosition = this.y - (this.speed / 1000) * deltaTime;
    if (newPosition < 0) newPosition = 0;
    this.y = newPosition;
  }

  down(deltaTime: number) {
    let newPosition = this.y + (this.speed / 1000) * deltaTime;
    if (newPosition + this.height > this.gHeight)
      newPosition = this.gHeight - this.height;
    this.y = newPosition;
  }

  shoot() {
    if (this.killed) return;
    const isDoubleShooted = this.doubleGun.shoot(this.x, this.y, {
      skip: !this.isDoubleGun,
    });
    if (isDoubleShooted) this.isDoubleGun = !this.isDoubleGun;
    const isShooted = this.gun.shoot(this.x + this.width / 2, this.y, {
      skip: this.isDoubleGun,
    });
    if (isShooted) this.isDoubleGun = !this.isDoubleGun;
  }
}

export default SpaceShip;
