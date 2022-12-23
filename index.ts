import { BASE_ENEMY_POSITION, BASE_PLAYER_POSITION, SPRITE_WIDTH } from './constants.js';
import { Fight } from './Fight.js';
import { Sprite } from './Sprite.js';

if (!document.getElementById('canvas')) {
	throw new Error('No canvas element found');
}
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.addEventListener('DOMContentLoaded', () => {
	const player = new Sprite('red', canvas, BASE_PLAYER_POSITION, { x: 0, y: 0 }, { x: 0, y: 0 });
	const enemy = new Sprite('blue', canvas, BASE_ENEMY_POSITION, { x: 0, y: 0 }, { x: -SPRITE_WIDTH, y: 0 });
	const fight = new Fight(player, enemy, canvas);

	fight.start();
});
