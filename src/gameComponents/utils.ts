import { GunScheme, Rect, Coord, Polygon } from './models';
import gameConfig from '../gameConfigs';
import Battlefield from './battlefield';
import { NestedObjectExtractor } from './utilityTypes';

export type RGB = [number, number, number];

export const randomRGB = (minIntensity: number, maxIntensity: number) => {
  const rgb = Array.from({ length: 3 }, () =>
    Math.round(Math.random() * maxIntensity)
  );
  if (rgb.every((c) => c < minIntensity)) {
    rgb[Math.floor(Math.random() * 3)] =
      Math.round(Math.random() * (maxIntensity - minIntensity)) + minIntensity;
  }
  return rgb as RGB;
};

export const rgbToRgbaString = (color: number[], alpha = 255) =>
  color.length > 2 ? `rgba(${color.slice(0, 4).join(', ')}, ${alpha})` : null;

export const randomRgbaString = (
  minIntensity: number,
  maxIntensity: number,
  alpha = 255
) => rgbToRgbaString(randomRGB(minIntensity, maxIntensity), alpha);

export const rectCollision = (rect1: Rect, rect2: Rect) =>
  rect1.x < rect2.x + rect2.width &&
  rect1.x + rect1.width > rect2.x &&
  rect1.y < rect2.y + rect2.height &&
  rect1.height + rect1.y > rect2.y;

export const getCanvasTextSize = (text: string, font: string) => {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.font = font;
    return ctx.measureText(text);
  }
};

export const getRandomEnemyConfig = () => {
  const invaders = gameConfig.invaderTypes;
  const probability = Math.random() * 100;
  if (probability > 75) return invaders['bigInvader'];
  if (probability <= 75) return invaders['littleInvader'];
  return invaders['littleInvader'];
};

export const getGunsFromProps = (
  battlefield: Battlefield,
  width: number,
  guns: GunScheme[]
) =>
  guns.map(
    (props) =>
      new props.gun(battlefield, props.rechargeSpeed, width, {
        enemy: props.enemy,
        color: props.color,
        configSpeed: props.speed,
      })
  );

export const copyToInstance = <
  Self extends object,
  Options extends NestedObjectExtractor<Self, Options>
>(
  self: Self,
  props: Options
) => {
  Object.assign(
    self,
    Object.entries(props)
      .filter(([, value]) => value !== undefined)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  );
};

export const rotateDot = (
  dot: Coord,
  angle: number,
  axis: Coord = { x: 0, y: 0 }
) => {
  if (!angle) return dot; //no angle, no need to rotate :)

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
): Polygon => {
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

  return { coords: [a, b, c], center };
};

export const rotatePolygon = (shape: Polygon, angle: number): Polygon => ({
  ...shape,
  coords: shape.coords.map((coord) => rotateDot(coord, angle, shape.center)),
});
