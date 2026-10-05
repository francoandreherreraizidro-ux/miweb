export class CollisionSystem {
  intersects(first, second) {
    const a = first.getBounds();
    const b = second.getBounds();

    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  findCollision(dinosaur, obstacles) {
    return obstacles.find((obstacle) => this.intersects(dinosaur, obstacle)) ?? null;
  }
}
