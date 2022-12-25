import { BASE_FIGHTER_ATTACK, BASE_TIME, STEP_LENGTH } from './constants.js';
import { determineWinner, keyListeners, rectangularCollision } from './helpers.js';
import { Sprite } from './Sprite.js';
import { FighterAbstract, FightOptions, Movements, SpriteAbstract } from './types.d.js';

export class Fight {
	UI: Record<string, HTMLElement> = {
		playerHealth: document.querySelector('#rightHealth'),
		enemyHealth: document.querySelector('#leftHealth'),
		timer: document.querySelector('.timer'),
		popup: document.querySelector('.popup'),
	};
	state = 'start';
	time = BASE_TIME;
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	backgrounds: SpriteAbstract[];
	player: FighterAbstract;
	enemy: FighterAbstract;
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

	constructor({ canvas, player, enemy }: FightOptions) {
		this.player = player;
		this.enemy = enemy;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.backgrounds = [
			new Sprite({
				canvas: canvas,
				position: { x: 0, y: 0 },
				imgSrc: './assets/img/Background.png',
				scale: 'fullscreen',
			}),
		];
	}

	animate = () => {
		window.requestAnimationFrame(this.animate);
		this.backgrounds.forEach(bg => bg.update());
		this.player.update();
		this.enemy.update();

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
			this.enemy.health -= BASE_FIGHTER_ATTACK;
			this.UI.enemyHealth.style.width = `${this.enemy.health}%`;
		}
		if (rectangularCollision({ rect1: this.enemy, rect2: this.player }) && this.enemy.isAttacking) {
			this.enemy.isAttacking = false;
			this.player.health -= BASE_FIGHTER_ATTACK;
			this.UI.playerHealth.style.width = `${this.player.health}%`;
		}

		// Check if fight is over
		if (this.player.health <= 0 || this.enemy.health <= 0) {
			this.end();
		}
	};

	keyUpListeners = e => keyListeners.Up(e, this.player, this.enemy);

	keyDownListeners = e => keyListeners.Down(e, this.player, this.enemy, this.movements, this.canvas);

	start = () => {
		this.time = BASE_TIME;
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
		this.state = determineWinner(this.player, this.enemy);
		this.UI.popup.querySelector('.title').innerHTML = this.state;
		this.UI.popup.classList.remove('hidden');
		this.UI.timer.innerHTML = '0';
		this.player.stop();
		this.enemy.stop();

		document.removeEventListener('keydown', this.keyDownListeners);
		document.removeEventListener('keyup', this.keyUpListeners);
	};
}
