import { Coordinates, SpriteOptions } from './types.d';
import { SpriteAbstract } from './types.js';

export class Sprite implements SpriteAbstract {
	public img: HTMLImageElement;
	public readonly ctx: CanvasRenderingContext2D;
	public position: Coordinates;
	public frames: number;
	public scale: number;
	public readonly canvas: HTMLCanvasElement;
	framesElapsed = 0;
	readonly framesHold = 5;
	currentFrame: number;
	offset?: Coordinates;

	constructor({
		canvas,
		position,
		imgSrc,
		scale = 1,
		frames = 1,
		offset = { x: 0, y: 0 },
		reversed = false,
	}: SpriteOptions) {
		this.img = new Image();
		this.img.src = imgSrc;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.position = position;
		this.frames = frames;
		if (scale === 'fullscreen') {
			this.img.onload = () => {
				this.scale = this.canvas.width / this.img.width;
			};
		} else {
			this.scale = scale;
		}
		this.currentFrame = 0;
		this.offset = offset;
	}

	public animateFrames() {
		if (this.frames > 1) {
			this.framesElapsed++;
			if (this.framesElapsed % this.framesHold === 0) {
				if (this.currentFrame === this.frames - 1) {
					this.currentFrame = 0;
				} else {
					this.currentFrame++;
				}
			}
		}
	}

	public draw() {
		this.animateFrames();

		this.ctx.drawImage(
			this.img,
			(this.img.width / this.frames) * this.currentFrame,
			0,
			this.img.width / this.frames,
			this.img.height,
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.img.width / this.frames) * this.scale,
			this.img.height * this.scale,
		);

		// this.addVisualDebug();
	}

	public addVisualDebug() {
		this.ctx.beginPath();
		this.ctx.strokeStyle = '#f00'; // some color/style
		this.ctx.lineWidth = 2; // thickness
		this.ctx.strokeRect(
			this.position.x - this.offset.x,
			this.position.y - this.offset.y,
			(this.img.width / this.frames) * this.scale,
			this.img.height * this.scale,
		);
	}

	update() {
		this.draw();
	}
}
