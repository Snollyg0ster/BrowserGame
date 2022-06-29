import { InvaderProps, InvaderTypes } from './gameComponents/models';
import littleInvaderImage from './assets/img/littleInvader.png';
import bigInvaderImage from './assets/img/bigInvader.png';
import Gun, { DoubleGun } from './gameComponents/guns';

export default {
  size: [700, 700] as [number, number],
  invaderTypes: {
    littleInvader: {
      height: 60,
      width: 60,
      image: [littleInvaderImage, 60, 60],
      hp: 5,
    },
    bigInvader: {
      reward: 22500,
      height: 100,
      width: 100,
      image: [bigInvaderImage, 100, 100],
      hp: 25,
      guns: [
        { rechargeSpeed: 2, enemy: true, gun: DoubleGun, color: '#cc0000dd' },
        {
          rechargeSpeed: 2,
          enemy: true,
          gun: Gun,
          speed: -600,
          color: '#ffaf1ae8',
        },
      ],
    },
  } as Record<InvaderTypes, InvaderProps>,
};
