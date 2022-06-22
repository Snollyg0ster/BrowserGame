class Score {
  private score = 0;

  constructor(private gWidth: number, private size: number) {

  }

  increaseScore(value: number) {
    this.score += value;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    ctx.font = `${this.size / 2}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`Score: ${this.score}`, this.gWidth - this.size * 3, this.size / 2);
  }
}

export default Score;