import { useEffect, useRef } from "react";
import gameConfigs from './gameConfigs';
import Game from "./gameLoop";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let game: Game | null = null

    if (canvasRef.current) {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      game = new Game(ctx);
    }

    return () => game?.stop();
  }, [canvasRef.current])

  return <>
    <canvas
      ref={canvasRef}
      width={gameConfigs.size[0]}
      height={gameConfigs.size[1]}
      style={{ border: '1px solid black' }}
    />
  </>
}

export default App;