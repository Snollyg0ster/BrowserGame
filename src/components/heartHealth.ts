class HeartHealth {
  private health = 0;

  constructor() {}

  drawHeart(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) {
    const height2 = height / 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x + width / 1.5,
      y - height / 1.5,
      x + width * 1.2,
      y + height / 2,
      x,
      y + height
    );
    ctx.bezierCurveTo(
      x - width * 1.2,
      y + height / 2,
      x - width / 1.5,
      y - height / 1.5,
      x,
      y
    );
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  updateHealth(value: number) {
    this.health = value;
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.health; i++) {
      this.drawHeart(ctx, 15 + i * 25, 8, 15, 15, 'red');
    }
  }
}

export default HeartHealth;
