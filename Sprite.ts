import { Coordinates, SpriteOptions } from './types.d';
import { SpriteAbstract } from './types.js';

export class Sprite implements SpriteAbstract {
	public readonly img: HTMLImageElement;
	public readonly ctx: CanvasRenderingContext2D;
	public position: Coordinates;
	public readonly frames: number;
	public scale: number;
	public readonly canvas: HTMLCanvasElement;
	framesElapsed = 0;
	readonly framesHold = 5;
	currentFrame: number;

	constructor({ canvas, position, imgSrc, scale, frames }: SpriteOptions) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.position = position;
		this.img = new Image();
		this.img.src = imgSrc;
		this.frames = frames || 1;
		this.img.onload = () => {
			if (scale === 'fullscreen') {
				this.scale = this.canvas.width / this.img.width;
			} else {
				this.scale = scale || 1;
			}
		};
		this.currentFrame = 0;
	}

	public draw() {
		if (this.frames > 1) {
			this.framesElapsed++;
			if (this.framesElapsed % this.framesHold === 0) {
				this.currentFrame === this.frames - 1 ? (this.currentFrame = 0) : this.currentFrame++;
			}
		}
		this.ctx.drawImage(
			this.img,
			(this.img.width / this.frames) * this.currentFrame,
			0,
			this.img.width / this.frames,
			this.img.height,
			this.position.x,
			this.position.y,
			(this.img.width / this.frames) * this.scale,
			this.img.height * this.scale,
		);
	}

	update() {
		this.draw();
	}
}
