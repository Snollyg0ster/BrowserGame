import { Coord, Polygon, RGB, RGBA } from "./models";
import { copyToInstance, getDistance, interpolateColor, rgbaToString, rotateDot } from "./utils";

export const equilateralTriangle = (
  center: Coord,
  size: number,
  angle = 0
): [Polygon, number] => {
  const { x, y } = center;
  const bisectorHeight = (size * Math.sqrt(3)) / 2;

  const a = rotateDot({ x, y: y - bisectorHeight / 2 }, angle, center);
  const b = rotateDot(
    { x: x - size / 2, y: y + bisectorHeight / 2 },
    angle,
    center
  );
  const c = rotateDot(
    { x: x + size / 2, y: y + bisectorHeight / 2 },
    angle,
    center
  );

  return [{ coords: [a, b, c], center }, bisectorHeight];
};

export const rotatePolygon = (shape: Polygon, angle: number): Polygon => ({
  ...shape,
  coords: shape.coords.map((coord) => rotateDot(coord, angle, shape.center))
});

export const moveDot = ({ x, y }: Coord, dx: number, dy: number) => ({
  x: x + dx,
  y: y + dy
});

export const movePolygon = (polygon: Polygon, dx: number, dy: number) => ({
  center: moveDot(polygon.center, dx, dy),
  coords: polygon.coords.map((coord) => moveDot(coord, dx, dy))
});

export class Triangle {
  x = 0;
  y = 0;
  size = 10;
  speed = 0;
  /**angle per step*/
  rotationSpeed = 0;
  directionAngle = 0;
  triangle: Polygon;
  bisectorHeight: number;
  color = "blue";

  constructor(private ctx: CanvasRenderingContext2D) {
    [this.triangle, this.bisectorHeight] = equilateralTriangle(this, this.size);
    this.triangle.center.y += this.bisectorHeight / 6;
  }

  updatePosition(pos: Coord) {
    this.x = pos.x;
    this.y = pos.y;
    // gsize && (this.gsize = gsize);
    [this.triangle, this.bisectorHeight] = equilateralTriangle(this, this.size);
    this.triangle.center.y += this.bisectorHeight / 6;
    return this;
  }

  // checkCollision() {
  //   const { gsize } = this;
  //   if (!gsize) return;
  //   this.triangle.coords.forEach(({ x, y }) => {
  //     const { width, height } = gsize;
  //     if (x >= width) this.speed.x = -Math.abs(this.speed.x);
  //     if (x <= 0) this.speed.x = Math.abs(this.speed.x);
  //     if (y >= height) this.speed.y = -Math.abs(this.speed.y);
  //     if (y <= 0) this.speed.y = Math.abs(this.speed.y);
  //   });
  // }

  update(delta: number) {
    const { speed, directionAngle } = this;
    const distance = speed * (delta / 1000);
    const dx = Math.sin(directionAngle) * distance;
    const dy = Math.cos(directionAngle) * distance;
    this.triangle = movePolygon(this.triangle, dx, dy);
    this.triangle = rotatePolygon(this.triangle, 5);
    // this.checkCollision();
  }

  draw() {
    if (!this.ctx) return;
    const { triangle } = this;
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    const { x, y } = triangle.coords[0];
    this.ctx?.moveTo(~~x, ~~y);
    triangle.coords.forEach((coord) => {
      this.ctx?.lineTo(coord.x, coord.y);
    });
    this.ctx.fill();
    this.ctx.closePath();
    // this.ctx.arc(triangle.center.x, triangle.center.y, 2, 0, 2 * Math.PI);
    // this.ctx.fillStyle = "blue";
    // this.ctx.fill();
  }
}

export class Explosion {
  trianglesNum = 20 ** 2;
  maxSpeed = 100;
  duration = 0.7;

  explosionProgress = 0;
  exist = true;
  colorInterpolation: [RGB, RGB] = [
    [255, 240, 0],
    [255, 0, 0]
  ]

  private triangles: Triangle[];

  constructor(
    ctx: CanvasRenderingContext2D,
    private x: number,
    private y: number,
    options?: Partial<{ trianglesNum: number;
      maxSpeed: number;
      duration: number; }>
  ) {
    options && copyToInstance(this, options)
    this.triangles = Array.from({ length: this.trianglesNum }).map(() => {
      const triangle = new Triangle(ctx);
      triangle.updatePosition({ x, y });
      triangle.speed = Math.random() * this.maxSpeed;
      triangle.directionAngle = Math.random() * 360;
      return triangle;
    });
  }

  draw(delta: number) {
    this.explosionProgress += delta;
    if (!this.exist) {
      return;
    }
    const liveTime = this.duration * 1000;
    if (this.explosionProgress > liveTime) {
      this.exist = false;
      this.triangles = [];
    }
    const colorAlpha = (liveTime - this.explosionProgress) / liveTime;
    this.triangles.forEach((triangle) => {
      const {x, y} = triangle.triangle.center;
      const distanceFromEpicenter = getDistance([x, y], [this.x, this.y]);
      const color = interpolateColor(...this.colorInterpolation, distanceFromEpicenter);
      triangle.color = rgbaToString([...color, colorAlpha]);
      triangle.update(delta);
      triangle.draw();
    });
  }
}