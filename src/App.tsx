import { useEffect, useRef } from "react";
import gameConfigs from './gameConfigs';
import drawGame from "./gameLoop";

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let game: ReturnType<typeof drawGame> | null = null

    if (canvasRef.current) {
      game = drawGame(canvasRef.current);
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