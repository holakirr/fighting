import {
  ASPECT_RATIO,
  BASE_ENEMY_OFFSET,
  BASE_ENEMY_VELOCITY,
  BASE_PLAYER_OFFSET,
  BASE_PLAYER_VELOCITY,
} from './constants.js';
import { Fight } from './Fight.js';
import { Fighter } from './Fighter.js';
import { getBaseEnemyPosition, getBasePlayerPosition } from './helpers.js';

if (!document.getElementById('canvas')) {
	throw new Error('No canvas element found');
}
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerWidth / ASPECT_RATIO;
if (canvas.height > window.innerHeight) {
	canvas.height = window.innerHeight;
	canvas.width = window.innerHeight * ASPECT_RATIO;
}

document.addEventListener('DOMContentLoaded', () => {
	const player = new Fighter({
		canvas,
		position: getBasePlayerPosition(canvas),
		color: 'red',
		attackOffset: BASE_PLAYER_OFFSET,
		velocity: BASE_PLAYER_VELOCITY,
		imgSrc: './assets/img/player1/Sprites/Idle.png',
		frames: 8,
		scale: 1.2,
		offset: {
			x: 100,
			y: -90,
		},
		sprites: {
			Idle: {
				imgSrc: './assets/img/player1/Sprites/Idle.png',
				frames: 8,
			},
			Attack1: {
				imgSrc: './assets/img/player1/Sprites/Attack1.png',
				frames: 6,
			},
			Death: {
				imgSrc: './assets/img/player1/Sprites/Death.png',
				frames: 6,
			},
			Jump: {
				imgSrc: './assets/img/player1/Sprites/Jump.png',
				frames: 2,
			},
			Fall: {
				imgSrc: './assets/img/player1/Sprites/Fall.png',
				frames: 2,
			},
			'Take Hit': {
				imgSrc: './assets/img/player1/Sprites/Take Hit.png',
				frames: 4,
			},
			Run: {
				imgSrc: './assets/img/player1/Sprites/Run.png',
				frames: 8,
			},
		},
	});
	const enemy = new Fighter({
		canvas,
		position: getBaseEnemyPosition(canvas),
		color: 'blue',
		attackOffset: BASE_ENEMY_OFFSET,
		velocity: BASE_ENEMY_VELOCITY,
		imgSrc: './assets/img/Fantasy Warrior/Sprites/Idle.png',
		frames: 10,
		scale: 1.481,
		offset: {
			x: 100,
			y: -90,
		},
		sprites: {
			Idle: {
				imgSrc: './assets/img/Fantasy Warrior/Sprites/Idle.png',
				frames: 10,
			},
			Attack1: {
				imgSrc: './assets/img/Fantasy Warrior/Sprites/Attack1.png',
				frames: 7,
			},
			Death: {
				imgSrc: './assets/img/Fantasy Warrior/Sprites/Death.png',
				frames: 7,
			},
			Jump: {
				imgSrc: './assets/img/Fantasy Warrior/Sprites/Jump.png',
				frames: 3,
			},
			Fall: {
				imgSrc: './assets/img/Fantasy Warrior/Sprites/Fall.png',
				frames: 3,
			},
			'Take Hit': {
				imgSrc: './assets/img/Fantasy Warrior/Sprites/Take Hit.png',
				frames: 3,
			},
			Run: {
				imgSrc: './assets/img/Fantasy Warrior/Sprites/Run.png',
				frames: 8,
			},
		},
	});
	const fight = new Fight({ canvas, player, enemy });

	fight.start();
});
