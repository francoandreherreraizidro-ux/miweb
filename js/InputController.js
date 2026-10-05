export class InputController {
  constructor() {
    this.jumpRequested = false;
    this.pauseRequested = false;
    this.listeners = [];
    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(event) {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
      event.preventDefault();
      this.jumpRequested = true;
    }
    if (event.code === 'KeyP') {
      event.preventDefault();
      this.pauseRequested = true;
    }
  }

  consumeJump() {
    const requested = this.jumpRequested;
    this.jumpRequested = false;
    return requested;
  }

  consumePause() {
    const requested = this.pauseRequested;
    this.pauseRequested = false;
    return requested;
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
