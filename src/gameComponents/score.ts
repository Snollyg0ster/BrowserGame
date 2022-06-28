import { getCanvasTextSize } from './utils';

class Score {
  private score = 0;
  private marginRight = 30;

  constructor(private gWidth: number, private size: number) {}

  increaseScore(value: number) {
    this.score += value;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const scoreBarHeight = this.size / 2;
    const font = `${this.size / 2}px serif`;
    const scoreText = `Score: ${this.score}`;
    const scoreBarWidth =
      (getCanvasTextSize(scoreText, scoreText)?.width || this.size * 3) +
      this.marginRight +
      20;

    ctx.clearRect(
      this.gWidth - scoreBarWidth,
      0,
      this.gWidth,
      scoreBarHeight + 100
    );

    ctx.fillStyle = 'red';
    ctx.font = font;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(scoreText, this.gWidth - this.marginRight, scoreBarHeight);
  }
}

export default Score;
