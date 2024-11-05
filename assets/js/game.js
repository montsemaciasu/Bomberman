class Game {
  constructor(ctx) {
    this.ctx = ctx;
    this.interval = null;
  }

  start() {
    this.bombsEnemy = [];
    this.bombsPlayer = [];
    this.box = new Box(this.ctx);
    this.destructible = new Destructible(this.ctx, this.box.positions);
    this.enemy = new Enemy(
      this.ctx,
      this.destructible,
      this.box,
      this.bombsEnemy
    );
    this.player = new Player(
      this.ctx,
      this.destructible,
      this.box,
      this.bombsPlayer
    );

    this.isGameOver = false;

    this.interval = setInterval(() => {
      this.clear();
      this.draw();
      this.move();
      this.checkCollisions();
    }, 1000 / 60);
  }

  gameOver() {
    if (this.isGameOver) return; // Evita la ejecución si ya es Game Over
    this.isGameOver = true; // Marca que el juego ha terminado
    this.pause();
    if (!this.player.isAlive) {
      document.getElementById("gameOverModal").style.display = "flex";
    }
    if (!this.enemy.isAlive) {
      document.getElementById("gameWinModal").style.display = "flex";
    }
  }

  pause() {
    clearInterval(this.interval);
  }

  draw() {
    if (this.player.isAlive) {
      this.player.draw();
    } else {
      this.player.drawDeath();
    }
    if (this.enemy.isAlive) {
      this.enemy.draw();
    } else {
      this.enemy.drawDeath();
    }

    this.box.draw();
    this.destructible.draw();
  }

  move() {
    this.player.move();
    this.enemy.move();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  checkCollisions() {
    this.player.checkCollisions();
    if (this.player.collidesWithBox(this.box)) {
      this.player.handleBoxCollision(this.box);
    }
    if (this.player.collidesWithDestructible(this.destructible)) {
      this.player.handleDestructibleCollision(this.destructible);
    }

    // Verificar si el jugador o el enemigo están en el rango de explosión de cualquier bomba
    this.checkExplosionRange(this.player, [
      ...this.bombsPlayer,
      ...this.bombsEnemy,
    ]);
    this.checkExplosionRange(this.enemy, [
      ...this.bombsPlayer,
      ...this.bombsEnemy,
    ]);

    if (this.player.isDeathDrawn || this.enemy.isDeathDrawn) {
      this.gameOver();
    }
  }

  checkExplosionRange(character, bombs) {
    bombs.forEach((bomb, index) => {
      bomb.draw();

      const cellSize = 65; // Tamaño de la celda donde explota con margen de 5
      const bombX = bomb.x;
      const bombY = bomb.y;

      if (character.collidesWithBomb()) {
        character.handleBombCollision();
      }
      const isInExplosionRange =
        (character.x >= bombX &&
          character.x <= bombX + 2 * cellSize &&
          character.y <= bombY + cellSize &&
          character.y >= bombY) || // derecha y diagonales
        (character.x <= bombX &&
          character.x >= bombX - 2 * cellSize &&
          character.y <= bombY + cellSize &&
          character.y >= bombY) || // izquierda y diagonales
        (character.y >= bombY &&
          character.y <= bombY + 2 * cellSize &&
          character.x <= bombX + cellSize &&
          character.x >= bombX) || // abajo y diagonales
        (character.y <= bombY &&
          character.y >= bombY - 2 * cellSize &&
          character.x <= bombX + cellSize &&
          character.x >= bombX) || // arriba y diagonales
        (character.x === bombX && character.y === bombY); // misma posición de la bomba

      if (
        isInExplosionRange &&
        !bomb.hasLaserDisappeared() &&
        character.isAlive
      ) {
        character.isAlive = false;
      }

      // Elimina la bomba después de que desaparezca la explosión
      if (bomb.hasDisappeared()) {
        const bombList =
          character === this.player ? this.bombsPlayer : this.bombsEnemy;
        bombList.splice(index, 1);
      }
    });
  }
  onKeyDown(code) {
    this.player.onKeyDown(code);
  }
  onKeyUp(code) {
    this.player.onKeyUp(code);
  }
}
