import { Movements } from './types';

export const GRAVITY = 0.7;
export const STEP = 5;
export const JUMP = 15;
export const HEIGHT = 150;
export const WIDTH = 50;
export const ATTACK_WIDTH = 100;
export const ATTACK_HEIGHT = 50;
export const BASE_PLAYER_POSITION = {
	x: 200,
	y: 100,
};
export const BASE_ENEMY_POSITION = {
	x: window.innerWidth - 200,
	y: 100,
};
export const movements: Movements = {
	a: {
		active: false,
	},
	w: {
		active: false,
	},
	d: {
		active: false,
	},
	s: {
		active: false,
	},
	arrowleft: {
		active: false,
	},
	arrowup: {
		active: false,
	},
	arrowright: {
		active: false,
	},
	arrowdown: {
		active: false,
	},
};
