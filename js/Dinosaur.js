import { GROUND_Y, PHYSICS } from './Config.js';

export class Dinosaur {
  constructor() {
    this.width = PHYSICS.dinosaurWidth;
    this.height = PHYSICS.dinosaurHeight;
    this.reset();
  }

  reset() {
    this.x = PHYSICS.dinosaurX;
    this.y = GROUND_Y - this.height;
    this.velocityY = 0;
    this.isGrounded = true;
    this.animationTime = 0;
  }

  jump() {
    if (!this.isGrounded) return false;
    this.velocityY = PHYSICS.jumpVelocity;
    this.isGrounded = false;
    return true;
  }

  update(deltaTime) {
    this.animationTime += deltaTime;
    this.velocityY += PHYSICS.gravity * deltaTime;
    this.y += this.velocityY * deltaTime;

    const floorY = GROUND_Y - this.height;
    if (this.y >= floorY) {
      this.y = floorY;
      this.velocityY = 0;
      this.isGrounded = true;
    }
  }

  getBounds() {
    return {
      x: this.x + 8,
      y: this.y + 4,
      width: this.width - 14,
      height: this.height - 7,
    };
  }

  get legPhase() {
    return Math.floor(this.animationTime * 12) % 2;
  }
}
