import Battlefield from './battlefield';
import Gun from './guns';
import HealthBar from './healthBar';
import { InvaderProps, Color, InvaderTypes } from './models';
import { getGunsFromProps } from './utils';

class Invader {
  private width = 60;
  readonly height: number = 60;
  private x = 0;
  private y = 0;
  private fullHealth: number;
  private guns: Gun[] | null = null;
  private texture: OffscreenCanvas | null = null;
  private healthBar: HealthBar;
  reward: number;
  hp: number;
  deleted = false;
  color: Color = 'blue';

  constructor(
    private ctx: CanvasRenderingContext2D,
    private gHeight: number,
    private speed: number,
    public type: InvaderTypes,
    battlefield: Battlefield,
    options?: InvaderProps
  ) {
    const { image, height, width, hp, color, guns, reward } = options || {};
    image && this.addTexture(...(image as [string]));
    height && (this.height = height);
    width && (this.width = width);
    this.fullHealth = hp || (this.height * this.width) / 360;
    this.reward = reward || (this.fullHealth / 2) * 1000;
    this.hp = this.fullHealth;
    this.color = color || 'blue';
    this.healthBar = new HealthBar(ctx, this.width, 5, this.fullHealth);
    this.healthBar.horisontalPadding = this.width / 6;
    this.healthBar.draw();

    const defaultGun = new Gun(battlefield, 2, this.width, { enemy: true });
    defaultGun.setColor('#cc0000dd');

    this.guns = guns
      ? getGunsFromProps(battlefield, this.width, guns)
      : [defaultGun];
  }

  get position() {
    return { y: this.y, x: this.x };
  }

  get size() {
    return { width: this.width, height: this.height };
  }

  get rect() {
    return { ...this.position, ...this.size, y: this.y - this.height };
  }

  get fullHp() {
    return this.fullHealth;
  }

  addTexture(texture: string, width?: number, height?: number) {
    const image = new Image();
    image.src = texture;
    image.onload = () => {
      const imageCanvas = new OffscreenCanvas(image.width, image.height);
      imageCanvas
        .getContext('2d')
        ?.drawImage(image, 0, 0, width || image.width, height || image.height);
      this.texture = imageCanvas;
    };
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  private shoot(time: number) {
    this.guns?.forEach((gun) =>
      gun.shoot(time, this.x, this.y, {
        elevate: false,
        speed: -300,
      })
    );
  }

  draw() {
    const textX = ~~this.x + this.width / 2;
    let textY = ~~this.y - this.height / 2;
    if (this.texture) {
      textY -= this.height / 2;
      this.ctx.drawImage(this.texture, ~~this.x, ~~this.y - this.height);
    } else {
      this.ctx.fillStyle = this.color || 'blue';
      this.ctx.fillRect(~~this.x, ~~this.y, this.width, -this.height);
    }

    // this.ctx.fillStyle = 'white';
    // this.ctx.font = '14px serif';
    // this.ctx.textAlign = 'center';
    // this.ctx.textBaseline = 'middle';
    // this.ctx.fillText(this.hp.toString(), textX, textY, 30);
    this.healthBar.update(~~this.x, ~~this.y - this.height - 15, this.hp);
    this.healthBar.draw();
  }

  fly(time: number, deltaTime: number) {
    const verticalPosition = this.y + (this.speed / 1000) * deltaTime;
    this.y = verticalPosition;
    if (verticalPosition - this.height > this.gHeight) this.deleted = true;
    else this.shoot(time);
    return this;
  }
}

export default Invader;
