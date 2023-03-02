import { useEffect, useState } from 'react';
import { clsx } from '../../utils';

interface Props {
  paused: boolean;
  continueGame: () => void;
  isDead: boolean;
  restartGame: () => void;
}

const GameMenu = (props: Props) => {
  const { paused, continueGame, isDead, restartGame } = props;

  const [zIndex, setZIndex] = useState(paused);

  useEffect(() => {
    isVisible && setZIndex(true);
  }, [paused, isDead]);

  const onTransitionEnd = () => !isVisible && setZIndex(false);

  const isVisible = paused || isDead;

  return (
    <div
      onTransitionEnd={onTransitionEnd}
      style={{ zIndex: zIndex ? 3 : 0 }}
      className={clsx('menu-container', {
        'menu-container__visible': isVisible,
      })}
    >
      <div className="menu">
        {isDead ? (
          <div className="menu-title ">Game Over</div>
        ) : (
          <div className="menu-title ">Game Paused</div>
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
  );
};

export default GameMenu;
