import { useEffect, useState } from 'react';
import { clsx } from '../../utils';

interface Props {
  score?: number;
  highScore?: number;
  paused: boolean;
  togglePause?: (pause: boolean) => void;
  isDead: boolean;
  restartGame: () => void;
}

const GameMenu = (props: Props) => {
  const { paused, togglePause, isDead, restartGame, score, highScore } = props;

  const [zIndex, setZIndex] = useState(paused);

  useEffect(() => {
    isVisible && setZIndex(true);
  }, [paused, isDead]);

  const onTransitionEnd = () => !isVisible && setZIndex(false);

  const continueGame = () => togglePause && togglePause(false);
  const pauseGame = () => togglePause && togglePause(true);

  const isVisible = paused || isDead;
  const newHighScore = isDead && score && highScore && score >= highScore;

  return (
    <>
      <div
        onTransitionEnd={onTransitionEnd}
        style={{ zIndex: zIndex ? 3 : 0 }}
        className={clsx('menu-container', {
          'menu-container__visible': isVisible,
        })}
      >
        <div className="score-container">
          {newHighScore ? (
            <div className="score-title score-title__new-high-score">
              New HighScore - {highScore}
            </div>
          ) : (
            <>
              <div className="score-title">HighScore: {highScore}</div>
              <div className="score-title">Score: {score}</div>
            </>
          )}
        </div>

        <div className="menu">
          {isDead ? (
            <div className="menu-title">Game Over</div>
          ) : (
            <div className="menu-title">Game Paused</div>
          )}

          <div className="buttons-container">
            {!isDead && (
              <div className="menu-button" onClick={continueGame}>
                continue
              </div>
            )}
            <div className="menu-button" onClick={restartGame}>
              restart
            </div>
          </div>
        </div>
      </div>
      {!isVisible && (
        <div className="pause-button" onClick={pauseGame}>
          <div />
          <div />
        </div>
      )}
    </>
  );
};

export default GameMenu;
