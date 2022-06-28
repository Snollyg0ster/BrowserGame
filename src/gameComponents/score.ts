import { getCanvasTextSize } from './utils';

class Score {
  private score = 0;
  private marginRight = 30;
  private y = 2;

  constructor(private gWidth: number, private size: number) {}

  increaseScore(value: number) {
    this.score += value;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const scoreBarHeight = this.size / 2;
    const font = `${this.size / 2}px serif`;
    const scoreText = `Score: ${this.score}`;
    const textWidth = getCanvasTextSize(scoreText, scoreText)?.width;
    const scoreBarWidth = (textWidth || this.size * 3) + this.marginRight + 30;

    ctx.clearRect(
      this.gWidth - scoreBarWidth,
      0,
      scoreBarWidth,
      scoreBarHeight + 100
    );

    ctx.fillStyle = 'red';
    ctx.font = font;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      scoreText,
      this.gWidth - this.marginRight,
      this.y + scoreBarHeight
    );
  }
}

export default Score;
