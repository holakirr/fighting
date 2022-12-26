import { ATTACK_HEIGHT, ATTACK_WIDTH, BASE_FIGHTER_HEALTH, GRAVITY, JUMP_HEIGHT } from './constants.js';
import { getFighterState, getFloorPos } from './helpers.js';
import { Sprite } from './Sprite.js';
import { FighterAbstract, FighterOptions, fighterStates, Keys, Sprites } from './types.js';

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
	public sprites: Sprites;
	public state: fighterStates = 'Idle';

	constructor({
		canvas,
		position,
		color,
		attackOffset,
		velocity,
		imgSrc,
		scale,
		frames,
		offset,
		sprites,
	}: FighterOptions) {
		super({ canvas: canvas, position, imgSrc, scale, frames, offset });

		this.attackBox.position = {
			x: this.position.x,
			y: this.position.y,
		};
		this.attackBox.offset = attackOffset;
		this.velocity = velocity;
		this.color = color;
		this.canvas = canvas;
		this.sprites = sprites;

		this.img.onload = () => {
			this.width = (this.img.width / this.frames) * this.scale;
			this.height = this.img.height * this.scale;
		};
	}
	updateImage() {
		this.currentFrame = 0;
		this.img.src = this.sprites[this.state].imgSrc;
		this.frames = this.sprites[this.state].frames;
	}

	update() {
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y;
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		const footPos = this.position.y + this.height + this.velocity.y;
		const floor = getFloorPos(this.canvas);

		if (footPos >= floor || this.position.y < 0) {
			this.velocity.y = 0;
			this.position.y = floor - this.height;
		} else {
			this.velocity.y += GRAVITY;
		}
		this.updateState();
		if (this.isAttacking) {
			console.log(this.currentFrame);
			console.log(this.frames);
		}
		super.update();
	}

	attack() {
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
			this.stop();
		}, 600);
	}

	stop() {
		this.velocity.x = 0;
		this.lastKey = null;
	}

	jump() {
		this.velocity.y = -JUMP_HEIGHT;
	}

	die() {
		this.velocity = {
			x: 0,
			y: 0,
		};
	}

	updateState() {
		let newState: fighterStates;
		if (this.isAttacking && this.currentFrame < this.sprites['Attack1'].frames) {
			newState = 'Attack1';
		} else {
			if (this.health <= 0) {
				newState = 'Death';
			} else {
				newState = getFighterState(this.velocity);
			}
		}

		if (newState !== this.state) {
			this.state = newState;
			this.updateImage();
		}
	}
}
