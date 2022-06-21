import { CSSProperties } from "react";
import { randomRgbaString } from "./utils";

class Bullet {
	private width = 5;
	private height = 15;
	private x = 0;
	private y = 0;
	color: CSSProperties['color'] = 'blue';

	constructor(
		x: number,
		y: number,
		private speed: number,
		color: string = 'blue'
	) {
		this.x = x - this.width / 2;
		this.y = y
		this.color = color;
	}

	get rect() {
		return {
			width: this.width,
			height: this.height,
			x: this.x,
			y: this.y,
		}
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