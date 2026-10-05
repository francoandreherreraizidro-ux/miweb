export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 360;
export const GROUND_Y = 286;

export const PHYSICS = Object.freeze({
  gravity: 2100,
  jumpVelocity: -760,
  dinosaurX: 112,
  dinosaurWidth: 48,
  dinosaurHeight: 58,
});

export const DIFFICULTY = Object.freeze({
  initialSpeed: 330,
  maxSpeed: 650,
  speedRamp: 4.2,
  firstSpawnDelay: 1.15,
  minSpawnDelay: 0.78,
  maxSpawnDelay: 1.65,
});

export const COLORS = Object.freeze({
  ink: '#17202a',
  muted: '#65727e',
  sky: '#f7fbff',
  ground: '#d7e1e8',
  accent: '#e85d3f',
  accentDark: '#b9402a',
  cloud: '#dceaf2',
});
