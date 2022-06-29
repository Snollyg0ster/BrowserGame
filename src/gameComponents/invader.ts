import { CSSProperties } from 'react';
import Battlefield from './battlefield';
import Bullet from './bullet';
import Gun from './guns';
import { InvaderProps } from './models';
import { getGunsFromProps } from './utils';

class Invader {
  private width = 60;
  readonly height: number = 60;
  private x = 0;
  private y = 0;
  private maxHp: number;
  private guns: Gun[] | null = null;
  private texture: OffscreenCanvas | null = null;
  reward: number;
  hp: number;
  deleted = false;
  color: CSSProperties['color'] = 'blue';

  constructor(
    private gHeight: number,
    private speed: number,
    battlefield: Battlefield,
    options?: InvaderProps
  ) {
    const { image, height, width, hp, color, guns, reward } = options || {};
    image && this.addTexture(...(image as [string]));
    height && (this.height = height);
    width && (this.width = width);
    this.maxHp = hp || (this.height * this.width) / 360;
    this.reward = reward || (this.maxHp / 2) * 1000;
    this.hp = this.maxHp;
    this.color = color || 'blue';

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

  get maxHP() {
    return this.maxHp;
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

  draw(ctx: CanvasRenderingContext2D) {
    const textX = ~~this.x + this.width / 2;
    let textY = ~~this.y - this.height / 2;
    if (this.texture) {
      textY -= this.height / 2;
      ctx.drawImage(this.texture, ~~this.x, ~~this.y - this.height);
    } else {
      ctx.fillStyle = this.color || 'blue';
      ctx.fillRect(~~this.x, ~~this.y, this.width, -this.height);
    }

    ctx.fillStyle = 'white';
    ctx.font = '14px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.hp.toString(), textX, textY, 30);
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
