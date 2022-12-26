import {
  ATTACK_HEIGHT,
  BASE_ATTACK_TIME,
  BASE_FIGHTER_ATTACK,
  BASE_FIGHTER_HEALTH,
  GRAVITY,
  JUMP_HEIGHT,
} from './constants.js';
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
		width: 0,
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
	public isHit = false;

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
		reversed = false,
	}: FighterOptions) {
		super({ canvas: canvas, position, imgSrc, scale, frames, offset, reversed });

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
			this.attackBox.width = this.width / 2;
		};
	}
	updateImage() {
		this.currentFrame = 0;
		this.img.src = this.sprites[this.state].imgSrc;
		this.frames = this.sprites[this.state].frames;
	}

	update() {
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
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
		// this.addVisualDebug();
		super.update();
	}

	addVisualDebug() {
		super.addVisualDebug();
		this.ctx.fillStyle = 'red';
		this.ctx.fillRect(
			this.attackBox.position.x,
			this.attackBox.position.y,
			this.attackBox.width,
			this.attackBox.height,
		);
	}

	attack() {
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
			this.stop();
		}, BASE_ATTACK_TIME);
	}

	stop() {
		this.velocity.x = 0;
		this.lastKey = null;
	}

	jump() {
		this.velocity.y = -JUMP_HEIGHT;
	}

	getHit() {
		this.isHit = true;
		this.health -= BASE_FIGHTER_ATTACK;
		setTimeout(() => {
			this.isHit = false;
		}, BASE_ATTACK_TIME);
	}

	die() {
		this.velocity = {
			x: 0,
			y: 0,
		};
	}

	updateState() {
		let newState: fighterStates;
		if (this.isHit) {
			newState = 'Take Hit';
		} else if (this.isAttacking && this.currentFrame < this.sprites['Attack1'].frames) {
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
