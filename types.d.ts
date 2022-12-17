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
	public position: Coordinates;
	public velocity: Coordinates;
	public readonly height: number;
	public readonly width: number;
	public lastKey: Keys;
	public attackBox: {
		position: Coordinates;
		width: number;
		height: number;
	};
	public isAttacking: boolean;

	abstract update(): void;
}

export type fightStates = 'start' | 'fight!' | 'draw' | 'player 1 win' | 'player 2 win';
