import { AudioManager } from './AudioManager.js';
import { Game } from './Game.js';
import { GameState } from './GameState.js';
import { InputController } from './InputController.js';
import { Renderer } from './Renderer.js';

const canvas = document.querySelector('#game-canvas');
const menuScreen = document.querySelector('#menu-screen');
const gameOverScreen = document.querySelector('#game-over-screen');
const pauseBadge = document.querySelector('#pause-badge');
const gameOverScore = document.querySelector('#game-over-score');
const playButton = document.querySelector('#play-button');
const replayButton = document.querySelector('#replay-button');
const pauseButton = document.querySelector('#pause-button');
const audioStatus = document.querySelector('#audio-status');

const ui = {
  onStateChange(state, scoreManager) {
    menuScreen.classList.toggle('is-visible', state === GameState.MENU);
    gameOverScreen.classList.toggle('is-visible', state === GameState.GAME_OVER);
    pauseBadge.classList.toggle('is-visible', state === GameState.PAUSED);
    pauseButton.setAttribute('aria-label', state === GameState.PAUSED ? 'Continuar partida' : 'Pausar partida');
    pauseButton.textContent = state === GameState.PAUSED ? '▶' : 'Ⅱ';
    if (state === GameState.GAME_OVER) gameOverScore.textContent = scoreManager.displayScore;
  },
};

const audio = new AudioManager();
const game = new Game({
  renderer: new Renderer(canvas),
  input: new InputController(),
  audio,
  ui,
});

function startGame() {
  game.start();
  audioStatus.textContent = audio.context ? 'Audio activo' : 'Audio no disponible';
}

playButton.addEventListener('click', startGame);
replayButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', () => game.togglePause());

ui.onStateChange(GameState.MENU, game.scoreManager);
game.render();
