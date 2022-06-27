class HeartHealth {
  private health = 0;
  size = 15;
  gap = 10;
  x = 15;
  y = 8;

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
    const healthBarWidth = this.x + (this.health + 1) * (this.size + this.gap);
    ctx.clearRect(0, 0, healthBarWidth, this.y + this.size);

    for (let i = 0; i < this.health; i++) {
      this.drawHeart(
        ctx,
        this.x + i * (this.size + this.gap),
        this.y,
        this.size,
        this.size,
        'red'
      );
    }
  }
}

export default HeartHealth;
