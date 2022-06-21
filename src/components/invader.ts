import { CSSProperties } from "react";

class Invader {
  private width = 60;
  readonly height = Math.random() > 0.6 ? 150 : 30;
  private x = 0;
  private y = 0;
  deleted = false;
  hp = this.height * this.width / 360;
  color: CSSProperties['color'] = 'blue';

  constructor(
    private gHeight: number,
    private speed: number,
    color: string = 'blue'
  ) {
    this.color = color;
  }

  get position() {
    return { y: this.y, x: this.x };
  }

  get size() {
    return { width: this.width, height: this.height };
  }

  get rect() {
    return { ...this.position, ...this.size, y: this.y - this.height }
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color || 'blue';
    ctx.fillRect(this.x, this.y, this.width, -this.height);
    ctx.fillStyle = 'white';
    ctx.font = "14px serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.hp.toString(), this.x + this.width / 2, this.y - this.height / 2, 30)
  }

  fly(deltaTime: number) {
    const verticalPosition = this.y + this.speed / 1000 * deltaTime;
    this.y = verticalPosition;
    if (verticalPosition - this.height > this.gHeight) this.deleted = true;
    return this;
  }
}

export default Invader;