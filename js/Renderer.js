import { COLORS, GAME_HEIGHT, GAME_WIDTH, GROUND_Y } from './Config.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.clouds = [
      { x: 110, y: 72, width: 78, speed: 0.08 },
      { x: 520, y: 116, width: 112, speed: 0.05 },
      { x: 820, y: 54, width: 64, speed: 0.1 },
    ];
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = GAME_WIDTH * pixelRatio;
    this.canvas.height = GAME_HEIGHT * pixelRatio;
    this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  render({ dinosaur, obstacles, score, highScore, speed, state, elapsedTime }) {
    const context = this.context;
    context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.drawBackground(context, elapsedTime, speed);
    obstacles.forEach((obstacle) => this.drawObstacle(context, obstacle));
    this.drawDinosaur(context, dinosaur);
    this.drawHud(context, score, highScore, speed, state);
  }

  drawBackground(context, elapsedTime, speed) {
    context.fillStyle = COLORS.sky;
    context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.clouds.forEach((cloud) => {
      const offset = (elapsedTime * speed * cloud.speed) % (GAME_WIDTH + cloud.width);
      const x = cloud.x - offset < -cloud.width ? cloud.x - offset + GAME_WIDTH + cloud.width : cloud.x - offset;
      this.drawCloud(context, x, cloud.y, cloud.width);
    });
    context.fillStyle = COLORS.ground;
    context.fillRect(0, GROUND_Y, GAME_WIDTH, 2);
    context.strokeStyle = '#c5d3dc';
    context.lineWidth = 2;
    context.setLineDash([14, 18]);
    context.lineDashOffset = -(elapsedTime * speed * 0.9) % 32;
    context.beginPath();
    context.moveTo(0, GROUND_Y + 13);
    context.lineTo(GAME_WIDTH, GROUND_Y + 13);
    context.stroke();
    context.setLineDash([]);
  }

  drawCloud(context, x, y, width) {
    context.fillStyle = COLORS.cloud;
    context.beginPath();
    context.arc(x + width * 0.22, y + 11, 12, 0, Math.PI * 2);
    context.arc(x + width * 0.43, y + 2, 19, 0, Math.PI * 2);
    context.arc(x + width * 0.66, y + 10, 14, 0, Math.PI * 2);
    context.roundRect(x, y + 10, width, 17, 8);
    context.fill();
  }

  drawDinosaur(context, dinosaur) {
    const { x, y, width, height } = dinosaur;
    const legOffset = dinosaur.isGrounded ? (dinosaur.legPhase ? 2 : -1) : 0;
    context.save();
    context.translate(x, y);
    context.fillStyle = COLORS.ink;
    context.beginPath();
    context.roundRect(13, 14, 30, 39, 8);
    context.roundRect(26, 3, 22, 24, 5);
    context.moveTo(14, 24); context.lineTo(0, 36); context.lineTo(15, 37);
    context.fill();
    context.fillStyle = COLORS.sky;
    context.beginPath(); context.arc(41, 10, 2.5, 0, Math.PI * 2); context.fill();
    context.fillStyle = COLORS.accent;
    context.fillRect(39, 19, 11, 3);
    context.fillStyle = COLORS.ink;
    context.fillRect(17, 49, 7, 10 + legOffset);
    context.fillRect(34, 49, 7, 10 - legOffset);
    context.fillRect(12, 57 + legOffset, 17, 3);
    context.fillRect(31, 57 - legOffset, 17, 3);
    context.restore();
  }

  drawObstacle(context, obstacle) {
    context.save();
    context.translate(obstacle.x, obstacle.y);
    context.fillStyle = COLORS.accentDark;
    context.beginPath();
    context.roundRect(9, 0, obstacle.width - 15, obstacle.height, 5);
    context.roundRect(0, 17, obstacle.width, 10, 4);
    if (obstacle.kind !== 'small') context.roundRect(obstacle.width - 10, 30, 10, 9, 3);
    context.fill();
    context.fillStyle = COLORS.accent;
    context.fillRect(14, 6, 4, obstacle.height - 14);
    context.restore();
  }

  drawHud(context, score, highScore, speed, state) {
    context.fillStyle = COLORS.ink;
    context.font = '600 14px Manrope, sans-serif';
    context.fillText(`SCORE ${score}`, 28, 32);
    context.fillStyle = COLORS.muted;
    context.fillText(`BEST ${highScore}`, 28, 53);
    if (state === 'PLAYING') {
      context.textAlign = 'right';
      context.fillText(`${Math.round(speed)} PX/S`, GAME_WIDTH - 28, 32);
      context.textAlign = 'left';
    }
  }
}
