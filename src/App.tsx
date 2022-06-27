import { useEffect, useRef } from "react";
import gameConfigs from './gameConfigs';
import Game from "./game";

const App = () => {
  const gameCanvas = useRef<HTMLCanvasElement | null>(null)
  const backgroundCanvas = useRef<HTMLCanvasElement | null>(null)
  const uiCanvas = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let game: Game | null = null

    if (gameCanvas.current && backgroundCanvas.current && uiCanvas.current) {
      const gameContext = gameCanvas.current?.getContext('2d');
      const backgroundContext = backgroundCanvas.current?.getContext('2d');
      const uiContext = uiCanvas.current?.getContext('2d');
      if (!(gameContext && backgroundContext && uiContext)) return;
      game = new Game(gameContext, uiContext, backgroundContext);
    }

    return () => game?.stop();
  }, [gameCanvas.current, backgroundCanvas?.current, uiCanvas?.current])

  return <div className="gameCont">
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
  </div>
}

export default App;