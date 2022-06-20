import { CSSProperties } from "react";

class Invader {
  private width = 60;
  private height = 30;
  private x = 0;
  private y = 0;
  color: CSSProperties['color'] = 'blue';

  constructor(
    private gHeight: number,
    x: number,
    y: number,
    private speed: number,
    color: string = 'blue'
  ) {
    this.x = x - this.width / 2;
    this.y = y
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color || 'blue';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  fly(deltaTime: number) {
    const verticalPosition = this.y + this.speed / 1000 * deltaTime;
    this.y = verticalPosition;
    if (verticalPosition > this.gHeight) return null;
    return this;
  }
}

export default Invader;