import stars from '../assets/img/stars1.png';

class Background {
  // private prevSecond = 0;
  private bgImage = new Image();
  private speed = 30;
  private prevPosition = 0;
  private position = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private gWidth: number,
    private gHeight: number
  ) {
    this.bgImage.src = stars;
    this.bgImage.onload = () => {
      this.position = -this.bgImage.height;
    };
  }

  draw(time: number, deltaTime: number) {
    if (!this.bgImage.complete) return;
    this.position += (deltaTime * this.speed) / 1000;
    if (this.prevPosition === ~~this.position) return;
    if (~~this.position >= 0) this.position = -this.bgImage.height;
    this.prevPosition = ~~this.position;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.gWidth, this.gHeight);
    const pattern = this.ctx.createPattern(this.bgImage, 'repeat');
    if (pattern) {
      this.ctx.fillStyle = pattern;
      this.ctx.translate(0, this.position);
      this.ctx.fillRect(0, 0, this.gWidth, this.gHeight + this.bgImage.height);
      this.ctx.translate(0, -this.position);
    }
  }
}

export default Background;
