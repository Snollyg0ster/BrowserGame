import { Color } from './models';

class HealthBar {
  private x = 0;
  private y = 0;
  private leftPadding = 0;
  private health = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private width: number,
    private height: number,
    private fullHealth: number
  ) {}

  set horisontalPadding(padding: number) {
    this.leftPadding = padding / 2;
    this.width -= padding;
  }

  update(x: number, y: number, health: number) {
    this.health = health;
    this.x = x + this.leftPadding;
    this.y = y;
  }

  bar(
    location: 'whole' | 'left' | 'right',
    color: Color,
    position?: { width: number; x: number }
  ) {
    const { width = this.width, x = this.x } = position || {};
    const radius = this.height / 2;

    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, this.y);

    if (location === 'left') {
      this.ctx.lineTo(x + width, this.y);
      this.ctx.lineTo(x + width, this.y + this.height);
    } else {
      this.ctx.moveTo(x, this.y);
      this.ctx.lineTo(x + width - radius, this.y);
      this.ctx.bezierCurveTo(
        x + width,
        this.y,
        x + width,
        this.y + this.height,
        x + width - radius,
        this.y + this.height
      );
    }

    if (location === 'right') {
      this.ctx.lineTo(x, this.y + this.height);
      this.ctx.lineTo(x, this.y);
    } else {
      this.ctx.lineTo(x + radius, this.y + this.height);
      this.ctx.bezierCurveTo(
        x,
        this.y + this.height,
        x,
        this.y,
        x + radius,
        this.y
      );
    }

    this.ctx.fillStyle = color!;
    this.ctx.fill();
  }

  draw() {
    if (this.health === this.fullHealth) {
      this.bar('whole', 'green');
      return;
    }

    if (this.health === 0) {
      this.bar('whole', 'red');
      return;
    }

    const hpWidth = this.width * (this.health / this.fullHealth);
    this.bar('left', 'green', { width: hpWidth, x: this.x });
    this.bar('right', 'red', {
      width: this.width - hpWidth,
      x: this.x + hpWidth,
    });
  }
}

export default HealthBar;
