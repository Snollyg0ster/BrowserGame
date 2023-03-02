import { Coord, Polygon } from "./models";
import { copyToInstance } from "./utils";

export type RGBA = [red: number, green: number, blue: number, alpha: number];
export type RGB = [red: number, green: number, blue: number];

export const interpolateColor = <T extends RGB | RGBA>(first: T, second: T, percentage: number) => {
  const color = [];
  for (let i = 0; i < first.length; i++) {
    color[i] = Math.round((first[i] * (100 - percentage) + second[i] * percentage) / 100);
  }
  return color as T;
}


export const rgbaToString = (color: RGBA) => //@ts-ignore
  `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3].toFixed(2)})`

export const getDistance = ([x1, y1]: number[], [x2, y2]: number[]) => {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};

export const degreeToRad = (degree: number) => (degree * Math.PI) / 180;

export const rotateDot = (
  dot: Coord,
  degree: number,
  axis: Coord = { x: 0, y: 0 }
) => {
  if (!degree) return dot; //no angle, no need to rotate :)
  const angle = degreeToRad(degree);
  let relativeToAxis = { x: dot.x - axis.x, y: dot.y - axis.y };
  const { x, y } = relativeToAxis;

  const rotatedX = Math.cos(angle) * x - Math.sin(angle) * y;
  const rotatedY = Math.sin(angle) * x + Math.cos(angle) * y;

  return { x: rotatedX + axis.x, y: rotatedY + axis.y };
};

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