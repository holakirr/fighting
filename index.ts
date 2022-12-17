import {
  BASE_ENEMY_POSITION,
  BASE_PLAYER_POSITION,
  BASE_TIME,
  JUMP_HEIGHT,
  movements,
  SPRITE_WIDTH,
  STEP_LENGTH,
} from './constants.js';
import { rectangularCollision } from './helpers.js';
import { Sprite } from './Sprite.js';
import { fightStates } from './types.d';

if (!document.getElementById('canvas')) {
	throw new Error('No canvas element found');
}
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
let fightTime = BASE_TIME;
let fightState: fightStates = 'start';
const UI = {
	container: document.getElementById('interface'),
	playerHealth: document.getElementById('rightHealth'),
	timer: document.getElementById('timer'),
	enemyHealth: document.getElementById('leftHealth'),
	popup: document.getElementById('popup'),
};
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
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

	// Check if fight is over
	if (player.health <= 0 || enemy.health <= 0) {
		endFight();
	}
};

animate();

const keyDownListeners = e => {
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
};

const keyUpListeners = e => {
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
};

document.addEventListener('keydown', keyDownListeners);
document.addEventListener('keyup', keyUpListeners);

const updateFight = () => {
	if (fightTime === BASE_TIME) {
		fightState = 'fight!';
		UI.popup.querySelector('.title').innerHTML = fightState;
		setTimeout(updateFight, 1000);
		fightTime--;
		return;
	}
	if (fightTime > 0) {
		UI.popup.classList.add('hidden');
		setTimeout(updateFight, 1000);
		UI.timer.innerHTML = fightTime.toString();
		fightTime--;
	}
	if (fightTime === 0) {
		endFight();
	}
};

const endFight = () => {
	if (player.health > enemy.health) {
		fightState = 'player 1 win';
	} else if (player.health < enemy.health) {
		fightState = 'player 2 win';
	} else {
		fightState = 'draw';
	}
	UI.popup.querySelector('.title').innerHTML = fightState;
	UI.popup.classList.remove('hidden');
	UI.timer.innerHTML = '0';

	document.removeEventListener('keydown', keyDownListeners);
	document.removeEventListener('keyup', keyUpListeners);
};

updateFight();
