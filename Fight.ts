import { BASE_TIME, JUMP_HEIGHT, STEP_LENGTH } from './constants.js';
import { rectangularCollision } from './helpers.js';
import { Movements } from './types.d.js';
import { SpriteAbstract } from './types.js';

export class Fight {
	UI: Record<string, HTMLElement> = {
		playerHealth: document.querySelector('#rightHealth'),
		enemyHealth: document.querySelector('#leftHealth'),
		timer: document.querySelector('.timer'),
		popup: document.querySelector('.popup'),
	};
	state = 'start';
	time = BASE_TIME;
	player: SpriteAbstract;
	enemy: SpriteAbstract;
	canvas: HTMLCanvasElement;
	movements: Movements = {
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
	ctx: CanvasRenderingContext2D;

	constructor(player, enemy, canvas) {
		this.player = player;
		this.enemy = enemy;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
	}

	keyDownListeners = e => {
		const key = e.key.toLowerCase();
		switch (key) {
			// Player
			case 'w':
				if (this.player.position.y + this.player.height === this.canvas.height) {
					this.player.velocity.y = -JUMP_HEIGHT;
				}
				break;
			case 'd':
			case 'a':
				this.movements[key].active = true;
				this.player.lastKey = key;
				break;
			case ' ':
				this.player.attack();
				break;
			// Enemy
			case 'arrowup':
				if (this.enemy.position.y + this.enemy.height === this.canvas.height) {
					this.enemy.velocity.y = -JUMP_HEIGHT;
				}
				break;
			case 'arrowright':
			case 'arrowleft':
				this.movements[key].active = true;
				this.enemy.lastKey = key;
				break;
			case 'enter':
				this.enemy.attack();
				break;
		}
	};

	keyUpListeners = e => {
		const key = e.key.toLowerCase();

		switch (key) {
			case 'd':
			case 'a':
				this.player.lastKey = undefined;
				break;
			case 'arrowright':
			case 'arrowleft':
				this.enemy.lastKey = undefined;
				break;
		}
	};

	animate = () => {
		window.requestAnimationFrame(this.animate);
		this.ctx.fillStyle = 'rgb(0, 0, 0)';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.player.update();
		this.enemy.update();

		this.player.velocity.x = 0;
		this.enemy.velocity.x = 0;

		// Player Movement
		if (this.movements.a.active && this.player.lastKey === 'a') {
			this.player.velocity.x = -STEP_LENGTH;
		} else if (this.movements.d.active && this.player.lastKey === 'd') {
			this.player.velocity.x = STEP_LENGTH;
		}

		// Enemy Movement
		if (this.movements.arrowleft.active && this.enemy.lastKey === 'arrowleft') {
			this.enemy.velocity.x = -STEP_LENGTH;
		} else if (this.movements.arrowright.active && this.enemy.lastKey === 'arrowright') {
			this.enemy.velocity.x = STEP_LENGTH;
		}

		// Detect collision
		if (rectangularCollision({ rect1: this.player, rect2: this.enemy }) && this.player.isAttacking) {
			this.player.isAttacking = false;
			this.enemy.health -= 20;
			this.UI.enemyHealth.style.width = `${this.enemy.health}%`;
			console.log('player hit');
		}
		if (rectangularCollision({ rect1: this.enemy, rect2: this.player }) && this.enemy.isAttacking) {
			this.enemy.isAttacking = false;
			this.player.health -= 20;
			this.UI.playerHealth.style.width = `${this.player.health}%`;
			console.log('enemy hit');
		}

		// Check if fight is over
		if (this.player.health <= 0 || this.enemy.health <= 0) {
			this.end();
		}
	};

	start = () => {
		this.animate();
		this.update();

		document.addEventListener('keydown', this.keyDownListeners);
		document.addEventListener('keyup', this.keyUpListeners);
	};

	update = () => {
		if (this.time === BASE_TIME) {
			this.state = 'fight!';
			this.UI.popup.querySelector('.title').innerHTML = this.state;
			setTimeout(this.update, 1000);
			this.time--;
			return;
		}
		if (this.time > 0) {
			this.UI.popup.classList.add('hidden');
			setTimeout(this.update, 1000);
			this.UI.timer.innerHTML = this.time.toString();
			this.time--;
		}
		if (this.time === 0) {
			this.end();
		}
	};

	end = () => {
		if (this.player.health > this.enemy.health) {
			this.state = 'player 1 win';
		} else if (this.player.health < this.enemy.health) {
			this.state = 'player 2 win';
		} else {
			this.state = 'draw';
		}
		this.UI.popup.querySelector('.title').innerHTML = this.state;
		this.UI.popup.classList.remove('hidden');
		this.UI.timer.innerHTML = '0';

		document.removeEventListener('keydown', this.keyDownListeners);
		document.removeEventListener('keyup', this.keyUpListeners);
	};
}
