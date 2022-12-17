import {
  BASE_ENEMY_POSITION,
  BASE_PLAYER_POSITION,
  JUMP_HEIGHT,
  movements,
  SPRITE_WIDTH,
  STEP_LENGTH,
} from './constants.js';
import { rectangularCollision } from './helpers.js';
import { Sprite } from './Sprite.js';

if (!document.getElementById('canvas')) {
	throw new Error('No canvas element found');
}
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const UI = {
	container: document.getElementById('interface'),
	playerHealth: document.getElementById('rightHealth'),
	timerBlock: document.getElementById('timer'),
	enemyHealth: document.getElementById('leftHealth'),
};
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = 600;
if (!ctx) {
	throw new Error('No canvas context found');
}

const player = new Sprite('red', canvas, BASE_PLAYER_POSITION, { x: 0, y: 0 }, { x: 0, y: 0 });
const enemy = new Sprite('blue', canvas, BASE_ENEMY_POSITION, { x: 0, y: 0 }, { x: -SPRITE_WIDTH, y: 0 });

const animate = () => {
	window.requestAnimationFrame(animate);
	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	// Player Movement
	if (movements.a.active && player.lastKey === 'a') {
		player.velocity.x = -STEP_LENGTH;
	} else if (movements.d.active && player.lastKey === 'd') {
		player.velocity.x = STEP_LENGTH;
	}

	// Enemy Movement
	if (movements.arrowleft.active && enemy.lastKey === 'arrowleft') {
		enemy.velocity.x = -STEP_LENGTH;
	} else if (movements.arrowright.active && enemy.lastKey === 'arrowright') {
		enemy.velocity.x = STEP_LENGTH;
	}

	// Detect collision
	if (rectangularCollision({ rect1: player, rect2: enemy }) && player.isAttacking) {
		player.isAttacking = false;
		enemy.health -= 20;
		UI.enemyHealth.style.width = `${enemy.health}%`;
		console.log('player hit');
	}
	if (rectangularCollision({ rect1: enemy, rect2: player }) && enemy.isAttacking) {
		enemy.isAttacking = false;
		player.health -= 20;
		UI.playerHealth.style.width = `${player.health}%`;
		console.log('enemy hit');
	}
};

animate();

window.addEventListener('keydown', e => {
	const key = e.key.toLowerCase();
	switch (key) {
		// Player
		case 'w':
			if (player.position.y + player.height === canvas.height) {
				player.velocity.y = -JUMP_HEIGHT;
			}
			break;
		case 'd':
		case 'a':
			movements[key].active = true;
			player.lastKey = key;
			break;
		case ' ':
			player.attack();
			break;
		// Enemy
		case 'arrowup':
			if (enemy.position.y + enemy.height === canvas.height) {
				enemy.velocity.y = -JUMP_HEIGHT;
			}
			break;
		case 'arrowright':
		case 'arrowleft':
			movements[key].active = true;
			enemy.lastKey = key;
			break;
		case 'enter':
			enemy.attack();
			break;
	}
});

window.addEventListener('keyup', e => {
	const key = e.key.toLowerCase();

	switch (key) {
		case 'd':
		case 'a':
			player.lastKey = undefined;
			break;
		case 'arrowright':
		case 'arrowleft':
			enemy.lastKey = undefined;
			break;
	}
});
