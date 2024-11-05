class Enemy {
  constructor(ctx, destructible, box, bombsEnemy) {
    this.ctx = ctx;
    this.destructible = destructible;
    this.box = box;
    this.bombsEnemy = bombsEnemy;

    this.w = 55;
    this.h = 55;

    this.x = 845;
    this.y = 705;

    this.cellSize = 70;

    this.x = Math.round(this.x / this.cellSize) * this.cellSize;
    this.y = Math.round(this.y / this.cellSize) * this.cellSize;

    this.vx = 0;
    this.vy = 0;

    this.speed = 2.5;

    this.ax = 1;
    this.ay = 1;

    this.img = new Image();
    this.img.frames = 3;
    this.img.frameIndex = 0;
    this.img.src = "/assets/images/enemyFrames.png";

    this.tickAlive = 0;
    this.tickDeath = 0;

    this.drawCount = 10;

    this.direction = "down";
    this.frameWidth = 19;
    this.frameHeight = 26.16;
    this.img.frameIndex = 0;

    this.isNearBomb = true;
    this.isAlive = true;
    this.isDeathDrawn = false;

    this.movingDirection = Math.floor(Math.random() * 4); // Definimos según el número de las constantes
    this.directionTimerDefault = Math.floor(Math.random() * 50) + 20;
    this.directionTimer = this.directionTimerDefault;
    this.failedAttempts = 0;
    this.stepsInSameDirection = 0;

    this.bombTimerDefault = 450;
    this.bombTimer = this.bombTimerDefault;
  }

  move() {
    // Primero, revisamos colisiones
    this.checkCollisions();

    this.bombTimer--;
    if (this.bombTimer <= 0) {
      this.putBomb();
      this.bombTimer = this.bombTimerDefault;
    }

    // obtenemos las posiciones libres
    const freePositions = this.getFreePositions();

    // Permitir cambio de dirección solo si está en una posición divisible de cellSize o si ha dado 5 pasos en la misma dirección
    if (
      (this.vx === 0 && this.vy === 0) ||
      this.directionTimer <= 0 ||
      this.stepsInSameDirection >= 5
    ) {
      // Sólo cambiar dirección si las coordenadas actuales son múltiplos de cellSize para evitar bugs
      if (
        (this.x % this.cellSize === 0 && this.y % this.cellSize === 0) ||
        this.stepsInSameDirection >= 5
      ) {
        this.directionTimer = this.directionTimerDefault;
        let targetX = this.x;
        let targetY = this.y;

        // Restablece el contador de pasos en la misma dirección si se va a cambiar
        if (this.stepsInSameDirection >= 5) {
          this.movingDirection = Math.floor(Math.random() * 4);
          this.stepsInSameDirection = 0; // Resetear contador
        }

        switch (this.movingDirection) {
          case 0: // Arriba
            targetY -= this.cellSize;
            this.vx = 0;
            this.vy = -this.speed;
            break;
          case 1: // Derecha
            targetX += this.cellSize;
            this.vx = this.speed;
            this.vy = 0;
            break;
          case 2: // Abajo
            targetY += this.cellSize;
            this.vx = 0;
            this.vy = this.speed;
            break;
          case 3: // Izquierda
            targetX -= this.cellSize;
            this.vx = -this.speed;
            this.vy = 0;
            break;
        }

        // Verificar si la posición objetivo está libre antes de moverse
        const isFree = freePositions.some(
          (pos) => pos.x === targetX && pos.y === targetY
        );

        if (!isFree) {
          this.failedAttempts++;

          // Si ha fallado varias veces, elige una dirección completamente nueva
          if (this.failedAttempts >= 2) {
            this.movingDirection = Math.floor(Math.random() * 4);
            this.failedAttempts = 0; // Restablecer el contador de intentos fallidos
          }

          this.vx = 0;
          this.vy = 0;
          return;
        } else {
          this.failedAttempts = 0;
        }

        this.targetX = targetX;
        this.targetY = targetY;
      }
    }

    // Movimiento poco a poco hacia la posición
    if (Math.abs(this.x - this.targetX) > this.speed) {
      this.x += this.vx;
    } else {
      this.x = this.targetX;
    }

    if (Math.abs(this.y - this.targetY) > this.speed) {
      this.y += this.vy;
    } else {
      this.y = this.targetY;
    }

    // Verificar si se alcanzó la posición objetivo exacta
    if (this.x === this.targetX && this.y === this.targetY) {
      this.vx = 0;
      this.vy = 0;
      this.stepsInSameDirection++; // Incrementa contador de pasos en la misma dirección

      if (this.directionTimer <= 0) {
        // Cambiar dirección solo si está en una coordenada múltiplo de cellSize o ha recorrido 5 pasos
        if (
          (this.x % this.cellSize === 0 && this.y % this.cellSize === 0) ||
          this.stepsInSameDirection >= 5
        ) {
          this.movingDirection = Math.floor(Math.random() * 4);
          this.stepsInSameDirection = 0; // Resetear contador después de cambiar
        }
      }
    }
    this.directionTimer--;
  }

  getFreePositions() {
    const allPositions = [];

    for (let i = 0; i < 13; i++) {
      for (let j = 0; j < 11; j++) {
        allPositions.push({ x: i * this.cellSize, y: j * this.cellSize });
      }
    }

    // Filtramos posiciones ocupadas, incluyendo las posiciones de las bombas
    const occupiedPositions = [
      ...this.box.positions,
      ...this.destructible.positions,
      ...this.bombsEnemy.map((bomb) => ({ x: bomb.x, y: bomb.y })),
    ];

    const freePositions = allPositions.filter((pos) => {
      const ocuped = occupiedPositions.some(
        (occ) => occ.x === pos.x && occ.y === pos.y
      );
      return !ocuped;
    });

    return freePositions;
  }

  draw() {
    this.getFreePositions();
    let row;

    switch (this.movingDirection) {
      case 0: // Arriba
        row = 2;
        break;
      case 1: // Derecha
        row = 0;
        break;
      case 2: // Abajo
        row = 1;
        break;
      case 3: // Izquierda
        row = 0;
        break;
    }

    this.ctx.save();

    // Si el jugador está mirando hacia la izquierda, invierte el contexto en el eje X (esto es para invertir la imagen)
    if (this.movingDirection === 3) {
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(
        this.img,
        this.img.frameIndex * this.frameWidth,
        row * this.frameHeight,
        this.frameWidth,
        this.frameHeight,
        -this.x - this.w,
        this.y,
        this.w,
        this.h
      );
    } else {
      this.ctx.drawImage(
        this.img,
        this.img.frameIndex * this.frameWidth,
        row * this.frameHeight,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }

    this.ctx.restore();

    // Incrementa el índice del frame solo si el jugador se está moviendo
    if (this.vx !== 0 || this.vy !== 0) {
      this.tickAlive++;
      if (this.tickAlive > 10) {
        this.tickAlive = 0;
        this.img.frameIndex++;
        if (this.img.frameIndex >= this.img.frames) {
          this.img.frameIndex = 0; // Reinicia al frame 0 en cada ciclo
        }
      }
    } else {
      this.img.frameIndex = 0; // Mantiene el frame 0 cuando está quieto
    }
  }

  drawDeath() {
    this.vy = 0;
    this.vx = 0;

    const row = 3;
    this.tickDeath++;

    if (this.tickDeath < 10) {
      this.img.frameIndex = 0;
    } else if (this.tickDeath < 20) {
      this.img.frameIndex = 1;
    } else if (this.tickDeath < 30) {
      this.img.frameIndex = 2;
    } else if (this.tickDeath < 40) {
      this.img.frameIndex = 3;
      this.frameWidth = 19.5;
    } else if (this.tickDeath < 50) {
      this.img.frameIndex = 4;
      this.frameWidth = 20;
    } else if (this.tickDeath < 60) {
      this.frameWidth = 20.3;
      this.img.frameIndex = 5;
    } else {
      this.isDeathDrawn = true;
    }

    this.ctx.drawImage(
      this.img,
      this.img.frameIndex * this.frameWidth,
      row * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.w,
      this.h
    );
  }

  checkCollisions() {
    // Colisión con el borde superior o inferior
    if (this.x + this.w > this.ctx.canvas.width) {
      this.x = this.ctx.canvas.width - this.w;
      this.vx = 0;
    } else if (this.x < 0) {
      this.x = 0;
      this.vx = 0;
    }

    // Colisión con el borde superior o inferior
    if (this.y + this.h > this.ctx.canvas.height) {
      this.y = this.ctx.canvas.height - this.h;
      this.vy = 0;
    } else if (this.y < 0) {
      this.y = 0;
      this.vy = 0;
    }
  }

  collidesWithBomb() {
    const enemyLeft = this.x;
    const enemyRight = this.x + this.w;
    const enemyTop = this.y;
    const enemyBottom = this.y + this.h;

    return this.bombsEnemy.some((bomb) => {
      const bombLeft = bomb.x;
      const bombRight = bomb.x + bomb.w;
      const bombTop = bomb.y;
      const bombBottom = bomb.y + bomb.h;

      const left = bombLeft - enemyLeft;
      const right = bombRight - enemyRight;
      const top = bombTop - enemyTop;
      const bottom = bombBottom - enemyBottom;

      // Si el jugador se ha movido fuera del rango de la bomba, desactivamos isNearBomb
      if (left <= -60 || right >= 60 || top >= 60 || bottom <= -60) {
        this.isNearBomb = false;
        console.log();
      }

      // Activamos si se acerca
      return (
        this.isNearBomb === false &&
        left > -65 &&
        right < 60 &&
        top < 60 &&
        bottom > -65
      );
    });
  }

  handleBombCollision() {
    const enemyLeft = this.x;
    const enemyRight = this.x + this.w;
    const enemyTop = this.y;
    const enemyBottom = this.y + this.h;
    this.bombsEnemy.forEach((bomb) => {
      if (this.collidesWithBomb()) {
        const bombLeft = bomb.x;
        const bombRight = bomb.x + bomb.w;
        const bombTop = bomb.y;
        const bombBottom = bomb.y + bomb.h;

        // Bloquear movimiento del jugador en función de la dirección de la bomba
        if (this.vx > 0 && enemyLeft < bombLeft && enemyRight > bombLeft) {
          this.vx = 0;
          this.x = bombLeft - this.w;
        } else if (this.vx < 0 && enemyRight > bombLeft && this.x > bombRight) {
          this.vx = 0;
          this.x = bombRight + 11;
        }
        // Si el jugador está moviéndose hacia abajo y colisiona con el lado superior del objeto
        else if (
          this.vy > 0 &&
          enemyBottom > bombTop &&
          enemyTop < bombTop &&
          enemyRight > bombLeft &&
          enemyLeft < bombRight
        ) {
          this.vy = 0;
          this.y = bombTop - this.h;
        }
        // Si el jugador está moviéndose hacia arriba y colisiona con el lado inferior del objeto
        else if (
          this.vy < 0 &&
          enemyTop < bombBottom + 10 &&
          enemyBottom > bombBottom + 10 &&
          enemyRight > bombLeft &&
          enemyLeft < bombRight
        ) {
          this.vy = 0;
          this.y = bombBottom + 10;
        }
      }
    });
  }

  putBomb() {
    let bombX = Math.floor((this.x + 30) / 70) * 70;
    let bombY = Math.floor((this.y + this.h - 10) / 70) * 70;

    // Pone la bomba
    const bomb = new Bomb(this.ctx, bombX, bombY, this.destructible, this.box);
    this.bombsEnemy.push(bomb);
    this.isNearBomb = true;
  }
}
