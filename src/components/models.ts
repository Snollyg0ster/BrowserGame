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