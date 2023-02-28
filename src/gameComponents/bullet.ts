import { CSSProperties } from 'react';
import { BulletProps } from './models';
import { randomRgbaString, copyToInstance } from './utils';

class Bullet {
  private width = 5;
  private height = 15;
  private x = 0;
  private y = 0;
  deleted = false;
  damage = 1;
  enemy = false;
  color: CSSProperties['color'] = 'blue';

  constructor(
    private gHeight: number,
    x: number,
    y: number,
    private speed: number,
    options?: BulletProps
  ) {
    options && copyToInstance(this, options);
    this.x = x - this.width / 2;
    this.y = y;
  }

  get rect() {
    return {
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
    };
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color || 'blue';
    ctx.fillRect(~~this.x, ~~this.y, this.width, this.height);
  }

  fly(deltaTime: number) {
    const verticalPosition = this.y - (this.speed / 1000) * deltaTime;
    this.y = verticalPosition;
    if (verticalPosition < 0 || verticalPosition >= this.gHeight)
      this.deleted = true;
  }

  upToSelfHeight() {
    this.y -= this.height;
  }
}

export default Bullet;
