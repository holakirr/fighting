import { GRAVITY, HEIGHT, JUMP, STEP, WIDTH } from './constants.js';
import { Coordinates, Keys, Movements, SpriteAbstract } from './types.d';

if (!document.getElementById('canvas')) {
	throw new Error('No canvas element found');
}
const canvas: HTMLCanvasElement = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = 600;
if (!ctx) {
	throw new Error('No canvas context found');
}

const movements: Movements = {
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

class Sprite implements SpriteAbstract {
	position: Coordinates;
	velocity: Coordinates;
	height = HEIGHT;
	width = WIDTH;
	lastKey: Keys;

	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;
	}

	draw() {
		if (!ctx) {
			throw new Error('No canvas context found');
		}

		ctx.fillStyle = 'red';
		const { x, y } = this.position;
		ctx.fillRect(x, y, this.width, this.height);
	}

	update() {
		this.draw();
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.position.y + this.height + this.velocity.y > canvas.height || this.position.y < 0) {
			this.velocity.y = 0;
			this.position.y = canvas.height - this.height;
		} else this.velocity.y += GRAVITY;
	}
}

const player = new Sprite({ position: { x: 10, y: 10 }, velocity: { x: 0, y: 1 } });
const enemy = new Sprite({ position: { x: canvas.width - 60, y: 10 }, velocity: { x: 0, y: 1 } });

const animate = () => {
	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	if (movements.a.active && player.lastKey === 'a') {
		player.velocity.x = -STEP;
	} else if (movements.d.active && player.lastKey === 'd') {
		player.velocity.x = STEP;
	}

	if (movements.arrowleft.active && enemy.lastKey === 'arrowleft') {
		enemy.velocity.x = -STEP;
	} else if (movements.arrowright.active && enemy.lastKey === 'arrowright') {
		enemy.velocity.x = STEP;
	}
	window.requestAnimationFrame(animate);
};

animate();

window.addEventListener('keydown', e => {
	const key = e.key.toLowerCase();

	switch (key) {
		case 'w':
			if (player.position.y + player.height === canvas.height) {
				player.velocity.y = -JUMP;
			}
			break;
		case 'd':
		case 'a':
			movements[key].active = true;
			player.lastKey = key;
			break;
		case 'arrowup':
			if (enemy.position.y + enemy.height === canvas.height) {
				enemy.velocity.y = -JUMP;
			}
			break;
		case 'arrowright':
		case 'arrowleft':
			movements[key].active = true;
			enemy.lastKey = key;
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
