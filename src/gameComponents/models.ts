import { CSSProperties } from 'react';
import Gun from './guns';

export type Color = CSSProperties['color'];

export type BattleFieldProps = Partial<{
  atackIntensity: number;
  atackPeriods: ([number, number] | [number])[];
}>;

export interface Coord {
  x: number;
  y: number;
}

export type Rect = {
  width: number;
  height: number;
} & Coord;

export type UpdateScore = (value: number) => void;

export type BulletProps = Partial<{
  color: string;
  enemy: boolean;
  damage: number;
}>;

export type GunProps = Partial<{
  enemy: boolean;
  configSpeed: number;
  color: Color;
  delay: number;
}>;

export interface GunScheme {
  rechargeSpeed: number;
  enemy: boolean;
  gun: typeof Gun;
  speed?: number;
  color?: Color;
}

export type ShootProps = Partial<{
  elevate: boolean;
  speed: number;
}>;

export type InvaderProps = Partial<{
  image:
    | [img: string, width: number, height: number]
    | [img: string, width: number]
    | [img: string];
  height: number;
  width: number;
  hp: number;
  guns: GunScheme[];
  color: string;
  reward: number;
}>;

export type InvaderTypes = 'littleInvader' | 'bigInvader';

export interface GunQueueItem {
  gun: Gun;
  timeGap: number;
}
