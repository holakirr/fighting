export type Keys = 'a' | 'w' | 'd' | 's' | 'arrowleft' | 'arrowup' | 'arrowright' | 'arrowdown';

export interface Movement {
	active: boolean;
}

export type Movements = Record<Keys, Movement>;

export interface Coordinates {
	x: number;
	y: number;
}

export abstract class SpriteAbstract {
	position: Coordinates;
	velocity: Coordinates;
	height: number;
	width: number;
	lastKey: Keys;

	constructor({ position, velocity }: { position: Coordinates; velocity: Coordinates });

	abstract draw(): void;

	abstract update(): void;
}
