import { buffer } from "stream/consumers";

export type BattleFieldProps = Partial<{
  atackIntensity: number;
  atackPeriods: ([number, number] | [number])[];
}>

export interface Coord {
  x: number;
  y: number;
}

export type Rect = {
  width: number,
  height: number,
} & Coord;

export type UpdateScore = (value: number) => void;

export type BulletProps = Partial<{
  color: string;
  enemy: boolean;
}>