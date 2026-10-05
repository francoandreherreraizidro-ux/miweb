import { GROUND_Y } from './Config.js';

const OBSTACLE_TYPES = Object.freeze([
  { kind: 'small', width: 30, height: 42 },
  { kind: 'wide', width: 58, height: 46 },
  { kind: 'tall', width: 34, height: 68 },
]);

export class Obstacle {
  constructor(x, typeIndex = 0) {
    const type = OBSTACLE_TYPES[typeIndex % OBSTACLE_TYPES.length];
    this.kind = type.kind;
    this.width = type.width;
    this.height = type.height;
    this.x = x;
    this.y = GROUND_Y - this.height;
    this.passed = false;
  }

  update(deltaTime, speed) {
    this.x -= speed * deltaTime;
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  getBounds() {
    return {
      x: this.x + 4,
      y: this.y + 3,
      width: this.width - 8,
      height: this.height - 3,
    };
  }
}
