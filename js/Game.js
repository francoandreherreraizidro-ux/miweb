import { CollisionSystem } from './CollisionSystem.js';
import { DIFFICULTY, GAME_WIDTH } from './Config.js';
import { Dinosaur } from './Dinosaur.js';
import { GameState } from './GameState.js';
import { Obstacle } from './Obstacle.js';
import { ScoreManager } from './ScoreManager.js';

export class Game {
  constructor({ renderer, input, audio, ui }) {
    this.renderer = renderer;
    this.input = input;
    this.audio = audio;
    this.ui = ui;
    this.dinosaur = new Dinosaur();
    this.scoreManager = new ScoreManager();
    this.collisionSystem = new CollisionSystem();
    this.obstacles = [];
    this.state = GameState.MENU;
    this.speed = DIFFICULTY.initialSpeed;
    this.spawnTimer = DIFFICULTY.firstSpawnDelay;
    this.elapsedTime = 0;
    this.lastFrameTime = 0;
    this.random = Math.random;
    this.frame = this.frame.bind(this);
  }

  start() {
    this.resetRun();
    this.setState(GameState.PLAYING);
    this.audio.ensureContext();
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.frame);
  }

  resetRun() {
    this.dinosaur.reset();
    this.obstacles = [];
    this.scoreManager.reset();
    this.speed = DIFFICULTY.initialSpeed;
    this.spawnTimer = DIFFICULTY.firstSpawnDelay;
    this.elapsedTime = 0;
  }

  setState(nextState) {
    this.state = nextState;
    this.ui.onStateChange(nextState, this.scoreManager);
  }

  togglePause() {
    if (this.state === GameState.PLAYING) this.setState(GameState.PAUSED);
    else if (this.state === GameState.PAUSED) {
      this.setState(GameState.PLAYING);
      this.lastFrameTime = performance.now();
      requestAnimationFrame(this.frame);
    }
  }

  frame(timestamp) {
    const deltaTime = Math.min((timestamp - this.lastFrameTime) / 1000, 0.05);
    this.lastFrameTime = timestamp;
    if (this.input.consumePause()) this.togglePause();
    if (this.state === GameState.PLAYING) this.update(deltaTime);
    this.render();
    if (this.state === GameState.PLAYING || this.state === GameState.PAUSED) requestAnimationFrame(this.frame);
  }

  update(deltaTime) {
    this.elapsedTime += deltaTime;
    if (this.input.consumeJump() && this.dinosaur.jump()) this.audio.playJump();
    this.speed = Math.min(DIFFICULTY.maxSpeed, this.speed + DIFFICULTY.speedRamp * deltaTime);
    this.dinosaur.update(deltaTime);
    this.updateObstacles(deltaTime);
    if (this.collisionSystem.findCollision(this.dinosaur, this.obstacles)) this.endRun();
    this.scoreManager.update(deltaTime, this.speed);
  }

  updateObstacles(deltaTime) {
    this.spawnTimer -= deltaTime;
    if (this.spawnTimer <= 0) {
      const typeIndex = Math.floor(this.random() * 3);
      this.obstacles.push(new Obstacle(GAME_WIDTH + 24, typeIndex));
      const difficultyFactor = Math.min(0.35, this.elapsedTime / 180);
      const range = DIFFICULTY.maxSpawnDelay - DIFFICULTY.minSpawnDelay - difficultyFactor;
      this.spawnTimer = DIFFICULTY.minSpawnDelay + this.random() * Math.max(0.2, range);
    }
    this.obstacles.forEach((obstacle) => obstacle.update(deltaTime, this.speed));
    this.obstacles = this.obstacles.filter((obstacle) => !obstacle.isOffScreen());
  }

  endRun() {
    this.audio.playCollision();
    this.audio.playGameOver();
    this.scoreManager.commitHighScore();
    this.setState(GameState.GAME_OVER);
  }

  render() {
    this.renderer.render({
      dinosaur: this.dinosaur,
      obstacles: this.obstacles,
      score: this.scoreManager.displayScore,
      highScore: this.scoreManager.displayHighScore,
      speed: this.speed,
      state: this.state,
      elapsedTime: this.elapsedTime,
    });
  }
}
