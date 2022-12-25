export type Keys = 'a' | 'w' | 'd' | 's' | 'arrowleft' | 'arrowup' | 'arrowright' | 'arrowdown';

export interface Movement {
	active: boolean;
}

export type Movements = Record<Keys, Movement>;

export interface Coordinates {
	x: number;
	y: number;
}

export interface SpriteOptions {
	canvas: HTMLCanvasElement;
	position: Coordinates;
	imgSrc: string;
	scale?: SpriteScale;
	frames?: number;
}

export abstract class SpriteAbstract {
	public readonly ctx: CanvasRenderingContext2D;
	public position: Coordinates;
	public img: HTMLImageElement;
	public readonly frames?: number;
	public readonly canvas: HTMLCanvasElement;
	public scale: number;
	framesElapsed: number;
	readonly framesHold: number;
	currentFrame: number;

	abstract draw(): void;
	abstract update(): void;
}

export interface FighterOptions {
	canvas: HTMLCanvasElement;
	position: Coordinates;
	color: string;
	offset: Coordinates;
	velocity: Coordinates;
}

export abstract class FighterAbstract extends SpriteAbstract {
	width: number;
	height: number;
	public attackBox: {
		position: Coordinates;
		width: number;
		height: number;
		offset: Coordinates;
	};
	public health: number;
	public isAttacking: boolean;
	public lastKey: Keys;
	public velocity: Coordinates;
	public color: string;
	public canvas: HTMLCanvasElement;
	// public state: fighterStates;

	public abstract attack(): void;
	// public abstract move(): void;
	// public abstract die(): void;
	public abstract stop(): void;
}

export type fightStates = 'start' | 'fight!' | 'draw' | 'player 1 win' | 'player 2 win';
export type fighterStates = 'idle' | 'attack' | 'move' | 'die';

export type SpriteScale = number | 'fullscreen';
