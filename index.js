if (!document.getElementById('canvas')) {
    throw new Error('No canvas element found');
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('No canvas context found');
}
const gravity = 0.2;
let lastDirection;
const movements = {
    up: {
        active: false,
    },
    left: {
        active: false,
    },
    down: {
        active: false,
    },
    right: {
        active: false,
    },
};
canvas.width = window.innerWidth;
canvas.height = 600;
ctx.fillRect(0, 0, canvas.width, canvas.height);
class Sprite {
    constructor({ position, velocity }) {
        this.height = 150;
        this.width = 50;
        this.position = position;
        this.velocity = velocity;
    }
    draw() {
        if (!ctx) {
            throw new Error('No canvas context found');
        }
        ctx.fillStyle = 'red';
        const { x, y } = this.position;
        ctx.fillRect(x, y, this.width, this.height);
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.position.y + this.height + this.velocity.y > canvas.height || this.position.y < 0) {
            this.velocity.y = 0;
            this.position.y = canvas.height - this.height;
        }
        else {
            this.velocity.y += gravity;
        }
    }
}
const player = new Sprite({ position: { x: 10, y: 10 }, velocity: { x: 0, y: 1 } });
const player2 = new Sprite({ position: { x: canvas.width - 60, y: 10 }, velocity: { x: 0, y: 1 } });
const animate = () => {
    window.requestAnimationFrame(animate);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    player2.update();
    player.velocity.x = 0;
    if (movements.left.active && lastDirection === 'left') {
        player.velocity.x = -5;
    }
    else if (movements.right.active && lastDirection === 'right') {
        player.velocity.x = 5;
    }
    else if (movements.up.active && lastDirection === 'up') {
        player.velocity.y = -5;
    }
};
animate();
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp' || 'w':
            if (player.position.y + player.height === canvas.height) {
                movements.up.active = true;
                lastDirection = 'up';
            }
        case 'ArrowRight' || 'd':
            movements.right.active = true;
            lastDirection = 'right';
            break;
        case 'ArrowLeft' || 'a':
            movements.left.active = true;
            lastDirection = 'left';
            break;
    }
    return () => {
        player.velocity.x = 0;
    };
});
window.addEventListener('keyup', e => {
    movements.left.active = false;
    movements.right.active = false;
});
export { animate };
