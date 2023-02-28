import { useEffect, useState } from 'react';
import { clsx } from '../../utils';

interface Props {
  paused: boolean;
  togglePause?: () => void;
}

const GameMenu = (props: Props) => {
  const { paused, togglePause } = props;

  const [zIndex, setZIndex] = useState(paused);

  const onTransitionEnd = () => !paused && setZIndex(false);

  useEffect(() => {
    paused && setZIndex(true);
  }, [paused]);

  return (
    <div
      onTransitionEnd={onTransitionEnd}
      style={{ zIndex: zIndex ? 3 : 0 }}
      className={clsx('menu-container', { 'menu-container__visible': paused })}
    >
      <div className="menu">
        <div className="menu-title ">Game Paused</div>
        <div className="buttons-container">
          <div className="menu-button" onClick={togglePause}>
            continue
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMenu;
