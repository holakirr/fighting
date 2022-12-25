import { ATTACK_HEIGHT, ATTACK_WIDTH, BASE_FIGHTER_HEALTH, GRAVITY } from './constants.js';
import { getFloorPos } from './helpers.js';
import { Sprite } from './Sprite.js';
import { FighterAbstract, FighterOptions, Keys } from './types.js';

export class Fighter extends Sprite implements FighterAbstract {
	public width: number;
	public height: number;
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
	public health = BASE_FIGHTER_HEALTH;
	public isAttacking = false;
	public lastKey: Keys;
	public velocity;
	public color: string;
	public canvas: HTMLCanvasElement;

	constructor({ canvas, position, color, offset, velocity, imgSrc, scale, frames }: FighterOptions) {
		super({ canvas: canvas, position, imgSrc, scale, frames });

		this.attackBox.position = {
			x: this.position.x,
			y: this.position.y,
		};
		this.attackBox.offset = offset;
		this.velocity = velocity;
		this.color = color;
		this.canvas = canvas;
		this.img.onload = () => {
			this.width = this.img.width / this.frames;
			this.height = this.img.height;
			console.log(this.width, this.height);
		};
	}

	update() {
		this.draw();
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y;
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		const height = this.position.y + this.height + this.velocity.y;
		const floor = getFloorPos(this.canvas);

		if (height >= floor || this.position.y < 0) {
			this.velocity.y = 0;
			this.position.y = floor - this.height;
		} else this.velocity.y += GRAVITY;
	}

	attack() {
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, 100);
	}

	stop() {
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.position = {
			x: this.position.x,
			y: getFloorPos(this.canvas) - this.height,
		};
		this.lastKey = null;
	}
}