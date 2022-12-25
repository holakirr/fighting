import { ASPECT_RATIO, SPRITE_WIDTH } from './constants.js';
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
const BASE_PLAYER_VELOCITY = { x: 0, y: 0 };
const BASE_ENEMY_VELOCITY = { x: 0, y: 0 };
const BASE_PLAYER_OFFSET = { x: 0, y: 0 };
const BASE_ENEMY_OFFSET = { x: -SPRITE_WIDTH, y: 0 };

document.addEventListener('DOMContentLoaded', () => {
	const player = new Fighter({
		canvas,
		position: getBasePlayerPosition(canvas),
		color: 'red',
		offset: BASE_PLAYER_OFFSET,
		velocity: BASE_PLAYER_VELOCITY,
		imgSrc: './assets/img/player1/sprites/Idle.png',
		frames: 8,
		scale: 1.5,
	});
	const enemy = new Fighter({
		canvas,
		position: getBaseEnemyPosition(canvas),
		color: 'blue',
		offset: BASE_ENEMY_OFFSET,
		velocity: BASE_ENEMY_VELOCITY,
		imgSrc: './assets/img/player2/sprites/Idle.png',
		frames: 4,
		scale: 1.5,
	});
	const fight = new Fight({ canvas, player, enemy });

	fight.start();
});
