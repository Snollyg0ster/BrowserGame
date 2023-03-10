export interface Links {
  feedback: string;
  problem: {
    arm: string;
    varm: string;
  };
}

export type GameContext = Record<
  'game' | 'ui' | 'background',
  CanvasRenderingContext2D
>;

export interface SettingsProps {
  setInvincible: (value: boolean) => void;
}

export type GameListeners = {
  onPaused: (paused: boolean, score: number) => void;
  onKilled: (score: number) => void;
  onRestart: () => void;
}