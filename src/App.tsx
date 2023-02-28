import { useEffect, useRef, useState } from 'react';
import gameConfigs from './gameConfigs';
import Game from './game';
import { SettingsProps } from './models';
import Settings from './components/Settings';
import GameMenu from './components/GameMenu';

const App = () => {
  const [game, setGame] = useState<Game>();
  const [paused, setPaused] = useState(false);

  const gameCanvas = useRef<HTMLCanvasElement | null>(null);
  const backgroundCanvas = useRef<HTMLCanvasElement | null>(null);
  const uiCanvas = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
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
  }, [gameCanvas.current, backgroundCanvas?.current, uiCanvas?.current]);

  useEffect(() => {
    if (game) {
      game.addListener('onPaused', setPaused);
    }
  }, [game]);

  return (
    <div className="root">
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
        <GameMenu paused={paused} togglePause={game?.togglePause.bind(game)}/>
      </div>
      <Settings settings={game?.getSettings()} />
    </div>
  );
};

export default App;
