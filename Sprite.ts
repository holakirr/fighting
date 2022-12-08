import { ATTACK_HEIGHT, ATTACK_WIDTH, GRAVITY, HEIGHT, WIDTH } from './constants.js';
import { Coordinates, Keys, SpriteAbstract } from './types.js';

export class Sprite implements SpriteAbstract {
	public readonly height = HEIGHT;
	public readonly width = WIDTH;
	public lastKey: Keys;
	public readonly attackBox = {
		position: {
			x: this.position.x,
			y: this.position.y,
		},
		width: ATTACK_WIDTH,
		height: ATTACK_HEIGHT,
		offset: {
			x: 0,
			y: 0,
		},
	};
	public isAttacking = false;
	private readonly ctx: CanvasRenderingContext2D;

	constructor(
		private color: string,
		private readonly canvas: HTMLCanvasElement,
		public position: Coordinates,
		public velocity: Coordinates,
		readonly offset: Coordinates,
	) {
		this.position = position;
		this.velocity = velocity;
		this.color = color;
		this.attackBox.position = {
			x: this.position.x,
			y: this.position.y,
		};
		this.attackBox.offset = offset;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
	}

	private draw() {
		// sprite
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

		// attackBox
		if (this.isAttacking) {
			this.ctx.fillStyle = 'green';
			this.ctx.fillRect(
				this.attackBox.position.x,
				this.attackBox.position.y,
				this.attackBox.width,
				this.attackBox.height,
			);
		}
	}

	update() {
		this.draw();
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y;
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this.position.y + this.height + this.velocity.y > this.canvas.height || this.position.y < 0) {
			this.velocity.y = 0;
			this.position.y = this.canvas.height - this.height;
		} else this.velocity.y += GRAVITY;
	}

	attack() {
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, 100);
		// this.attackBox.position.x = this.position.x + this.width;
		// this.attackBox.position.y = this.position.y / 2;
	}
}
