import { SCENE_HEIGHT, SPRITE_WIDTH } from './constants.js';
import { Coordinates, FighterAbstract, fighterStates } from './types.d.js';

export const rectangularCollision = ({ rect1, rect2 }: { rect1: FighterAbstract; rect2: FighterAbstract }) =>
	rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
	rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
	rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
	rect1.attackBox.position.y <= rect2.position.y + rect2.height;

export const determineWinner = (player1: FighterAbstract, player2: FighterAbstract): string => {
	if (player1.health > player2.health) {
		return 'player 1 win';
	} else if (player1.health < player2.health) {
		return 'player 2 win';
	} else {
		return 'draw';
	}
};

export const getFloorPos = canvas => canvas.height * SCENE_HEIGHT;

export const keyListeners = {
	Up: (e, player1, player2) => {
		e.preventDefault();
		const key = e.key.toLowerCase();

		switch (key) {
			case 'd':
			case 'a':
			case ' ':
				player1.stop();
				break;
			case 'arrowright':
			case 'arrowleft':
			case 'enter':
				player2.stop();
				break;
		}
	},
	Down: (e, player1, player2, movements, canvas) => {
		e.preventDefault();
		const key = e.key.toLowerCase();
		const floorPos = getFloorPos(canvas);

		switch (key) {
			// Player
			case 'w':
				const playerPos = player1.position.y + player1.height;
				if (playerPos === floorPos) {
					player1.jump();
				}
				break;
			case 'd':
			case 'a':
				movements[key].active = true;
				player1.lastKey = key;
				break;
			case ' ':
				player1.attack();
				break;
			// Enemy
			case 'arrowup':
				const enemyPos = player2.position.y + player2.height;
				if (enemyPos === floorPos) {
					player2.jump();
				}
				break;
			case 'arrowright':
			case 'arrowleft':
				movements[key].active = true;
				player2.lastKey = key;
				break;
			case 'enter':
				player2.attack();
				break;
		}
	},
};

export const getBasePlayerPosition = (canvas: HTMLCanvasElement) => ({
	x: canvas.width / 4 - SPRITE_WIDTH,
	y: 0,
});
export const getBaseEnemyPosition = (canvas: HTMLCanvasElement) => ({
	x: (canvas.width / 4) * 3,
	y: 0,
});

export const getFighterState = (velocity: Coordinates): fighterStates => {
	if (velocity.y < 0) {
		return 'Jump';
	} else if (velocity.y > 0) {
		return 'Fall';
	} else if (velocity.x !== 0) {
		return 'Run';
	} else {
		return 'Idle';
	}
};
