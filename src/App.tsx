import { useEffect, useRef, useState } from 'react';
import gameConfigs from './gameConfigs';
import Game from './game';
import GameMenu from './components/GameMenu';
import Settings from './components/settings';
import { getHighScore, recordHighScore } from './utils';

const App = () => {
  const [game, setGame] = useState<Game>();
  const [paused, setPaused] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [score, setScore] = useState<number>();
  const [highScore, setHighScore] = useState<number>();

  const gameCanvas = useRef<HTMLCanvasElement | null>(null);
  const backgroundCanvas = useRef<HTMLCanvasElement | null>(null);
  const uiCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isDead) {
      return;
    }

    let game: Game | null = null;

    if (gameCanvas.current && backgroundCanvas.current && uiCanvas.current) {
      const gameContext = gameCanvas.current?.getContext('2d');
      const backgroundContext = backgroundCanvas.current?.getContext('2d', {
        alpha: false,
      });
      const uiContext = uiCanvas.current?.getContext('2d');
      if (!(gameContext && backgroundContext && uiContext)) return;
      game = new Game({
        game: gameContext,
        ui: uiContext,
        background: backgroundContext,
      });
      setGame(game);
    }

    return () => game?.stop();
  }, [
    gameCanvas.current,
    backgroundCanvas?.current,
    uiCanvas?.current,
    isDead,
  ]);

  useEffect(() => {
    if (game) {
      game.addListener('onPaused', onPaused);
      game.addListener('onKilled', onKilled);
      game.addListener('onRestart', restart);
    }
  }, [game]);

  useEffect(() => {
    getHighScore().then((value) => setHighScore(value));
  }, []);

  const onPaused = (pause: boolean, score: number) => {
    setPaused(pause);
    setScore(score);
  };

  const onKilled = (score: number) => {
    setScore(score);
    if (!highScore || score > highScore) {
      setHighScore(score);
      recordHighScore(score);
    }
    setIsDead(true);
  };

  const continueGame = () => game?.togglePause(false);

  const restart = () => {
    setIsDead(true);
    setTimeout(() => setIsDead(false));
    continueGame();
  };

  return (
    <>
      <div className="gameCont">
        <canvas
          ref={backgroundCanvas}
          width={gameConfigs.size[0]}
          height={gameConfigs.size[1]}
          className="canvas background"
        />
        <canvas
          ref={gameCanvas}
          width={gameConfigs.size[0]}
          height={gameConfigs.size[1]}
          className="canvas game"
        />
        <canvas
          ref={uiCanvas}
          width={gameConfigs.size[0]}
          height={gameConfigs.size[1]}
          className="canvas ui"
        />
        <GameMenu
          score={score}
          highScore={highScore}
          paused={paused}
          isDead={isDead}
          restartGame={restart}
          continueGame={continueGame}
        />
      </div>
      <Settings settings={game?.getSettings()} />
    </>
  );
};

export default App;
