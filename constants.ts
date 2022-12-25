import { Movements } from './types';

export const GRAVITY = 0.7;
export const ASPECT_RATIO = 1;
export const BASE_FIGHTER_HEALTH = 100;
export const BASE_FIGHTER_ATTACK = 20;
export const SCENE_HEIGHT = 0.785;
export const STEP_LENGTH = 5;
export const JUMP_HEIGHT = 15;
export const SPRITE_HEIGHT = 150;
export const SPRITE_WIDTH = 50;
export const ATTACK_WIDTH = 100;
export const ATTACK_HEIGHT = 50;
export const BASE_TIME = 10;
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
