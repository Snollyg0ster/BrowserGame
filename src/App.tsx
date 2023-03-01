import { useEffect, useRef, useState } from 'react';
import gameConfigs from './gameConfigs';
import Game from './game';
import Settings from './components/Settings';
import GameMenu from './components/GameMenu';

const App = () => {
  const [game, setGame] = useState<Game>();
  const [paused, setPaused] = useState(false);
  const [isDead, setIsDead] = useState(false);

  const gameCanvas = useRef<HTMLCanvasElement | null>(null);
  const backgroundCanvas = useRef<HTMLCanvasElement | null>(null);
  const uiCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isDead) {
      return
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
  }, [gameCanvas.current, backgroundCanvas?.current, uiCanvas?.current, isDead]);

  useEffect(() => {
    if (game) {
      game.addListener('onPaused', setPaused);
      game.addListener('onKilled', () => setIsDead(true));
    }
  }, [game]);

  const restart = () => setIsDead(false);

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
          paused={paused}
          togglePause={game?.togglePause.bind(game)}
          isDead={isDead}
          restartGame={restart}
        />
      </div>
      <Settings settings={game?.getSettings()} />
    </>
  );
};

export default App;
