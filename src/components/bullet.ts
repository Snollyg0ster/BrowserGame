import { CSSProperties } from "react";

class Bullet {
	private width = 10;
	private height = 25;
	private x = 0;
	private y = 0;
	color: CSSProperties['color'] = 'blue';

	constructor(
		x: number,
		y: number,
		private speed: number,
	) {
		this.x = x - this.width / 2;
		this.y = y
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.color || 'blue';
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	fly(deltaTime: number) {
		const verticalPosition = this.y - this.speed / 1000 * deltaTime;
		this.y = verticalPosition;
		if (verticalPosition < 0) return null;
		return this;
	}

	upToSelfHeight() {
		this.y -= this.height;
	}
}

export default Bullet;