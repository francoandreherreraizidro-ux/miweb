export class ScoreManager {
  constructor() {
    this.highScore = 0;
    this.reset();
  }

  reset() {
    this.score = 0;
  }

  update(deltaTime, speed) {
    this.score += deltaTime * speed * 0.035;
  }

  get displayScore() {
    return Math.floor(this.score).toString().padStart(5, '0');
  }

  commitHighScore() {
    this.highScore = Math.max(this.highScore, Math.floor(this.score));
  }

  get displayHighScore() {
    return this.highScore.toString().padStart(5, '0');
  }
}
