import { RGB } from "./models";

export class Damage {
  color: RGB = [255, 0 ,0];
  duration = 0.5;

  private progress = 0;

  constructor(
    public ctx: CanvasRenderingContext2D,
    private width: number,
    private height: number,
    ) {}

  draw(deltaTime: number, x: number, y: number) {
    this.ctx.fillRect(x, y, this.width, this.height);
  }
}