import { GunScheme, Rect } from './models';
import gameConfig from '../gameConfigs';
import Battlefield from './battlefield';

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
