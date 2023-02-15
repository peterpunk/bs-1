import * as ships from './ships';

export const config = { 
  plan: [
    ships.BATTLESHIP,
    ships.DESTROYER,
    ships.DESTROYER
  ],
  cheatMode: process.env.CHEAT_MODE === 'true',
}
