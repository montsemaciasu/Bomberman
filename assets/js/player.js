class Player {
  constructor(ctx, destructible, box, bombsPlayer) {
    this.ctx = ctx;
    this.destructible = destructible;
    this.box = box;
    this.bombsPlayer = bombsPlayer;

    this.w = 55;
    this.h = 55;

    this.x = 5;
    this.y = 5;

    this.vx = 0;
    this.vy = 0;

    this.speed = 2.5;

    this.ax = 1;
    this.ay = 1;

    this.img = new Image();
    this.img.frames = 3;
    this.img.frameIndex = 0;
    this.img.src = "/assets/images/playerFrames.png";

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
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    this.checkCollisions();
  }

  draw() {
    let row;
    if (this.direction === "down") {
      row = 1;
    } else if (this.direction === "left" || this.direction === "right") {
      row = 0;
    } else if (this.direction === "up") {
      row = 2;
    }

    this.ctx.save();

    // Si el jugador está mirando hacia la izquierda, invierte el contexto en el eje X (esto es para invertir la imagen)
    if (this.direction === "left") {
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
          this.img.frameIndex = 0;
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

  // Métodos de colisiones

  collidesWithBox(box) {
    const playerLeft = this.x;
    const playerRight = this.x + this.w;
    const playerTop = this.y;
    const playerBottom = this.y + this.h;

    // devolver si colisiona
    return box.positions.some((pos) => {
      const boxLeft = pos.x;
      const boxRight = pos.x + box.w;
      const boxTop = pos.y;
      const boxBottom = pos.y + box.h;

      const colX = playerRight > boxLeft && playerLeft < boxRight;
      const colY = playerBottom > boxTop && playerTop < boxBottom;

      return colX && colY;
    });
  }

  handleBoxCollision(box) {
    box.positions.forEach((pos) => {
      const boxLeft = pos.x;
      const boxRight = pos.x + box.w;
      const boxTop = pos.y;
      const boxBottom = pos.y + box.h;

      if (this.collidesWithBox({ positions: [pos], w: box.w, h: box.h })) {
        if (this.vx > 0 && this.x + this.w > boxLeft && this.x < boxLeft) {
          this.vx = 0;
          this.x = boxLeft - this.w;
        }
        if (this.vx < 0 && this.x < boxRight && this.x + this.w > boxRight) {
          this.vx = 0;
          this.x = boxRight;
        }
        if (this.vy > 0 && this.y + this.h > boxTop && this.y < boxTop) {
          this.vy = 0;
          this.y = boxTop - this.h;
        }
        if (this.vy < 0 && this.y < boxBottom && this.y + this.h > boxBottom) {
          this.vy = 0;
          this.y = boxBottom;
        }
      }
    });
  }
  collidesWithDestructible(destructible) {
    const playerLeft = this.x;
    const playerRight = this.x + this.w;
    const playerTop = this.y;
    const playerBottom = this.y + this.h;
    // devolver si colisiona
    return destructible.positions.some((pos) => {
      const destructibleLeft = pos.x;
      const destructibleRight = pos.x + destructible.w;
      const destructibleTop = pos.y;
      const destructibleBottom = pos.y + destructible.h;

      const colX =
        playerRight > destructibleLeft && playerLeft < destructibleRight;
      const colY =
        playerBottom > destructibleTop && playerTop < destructibleBottom;

      return colX && colY;
    });
  }

  handleDestructibleCollision(destructible) {
    destructible.positions.forEach((pos) => {
      const destructibleLeft = pos.x;
      const destructibleRight = pos.x + destructible.w;
      const destructibleTop = pos.y;
      const destructibleBottom = pos.y + destructible.h;

      if (
        this.collidesWithDestructible({
          positions: [pos],
          w: destructible.w,
          h: destructible.h,
        })
      ) {
        // Si el jugador está moviéndose hacia la derecha y colisiona con el lado izquierdo del objeto
        if (
          this.vx > 0 &&
          this.x + this.w > destructibleLeft &&
          this.x < destructibleLeft
        ) {
          this.vx = 0;
          this.x = destructibleLeft - this.w;
        }
        // Si el jugador está moviéndose hacia la izquierda y colisiona con el lado derecho del objeto
        if (
          this.vx < 0 &&
          this.x < destructibleRight &&
          this.x + this.w > destructibleRight
        ) {
          this.vx = 0;
          this.x = destructibleRight;
        }
        // Si el jugador está moviéndose hacia abajo y colisiona con el lado superior del objeto
        if (
          this.vy > 0 &&
          this.y + this.h > destructibleTop &&
          this.y < destructibleTop
        ) {
          this.vy = 0;
          this.y = destructibleTop - this.h;
        }
        // Si el jugador está moviéndose hacia arriba y colisiona con el lado inferior del objeto
        if (
          this.vy < 0 &&
          this.y < destructibleBottom &&
          this.y + this.h > destructibleBottom
        ) {
          this.vy = 0;
          this.y = destructibleBottom;
        }
      }
    });
  }

  collidesWithBomb() {
    const playerLeft = this.x;
    const playerRight = this.x + this.w;
    const playerTop = this.y;
    const playerBottom = this.y + this.h;

    return this.bombsPlayer.some((bomb) => {
      const bombLeft = bomb.x;
      const bombRight = bomb.x + bomb.w;
      const bombTop = bomb.y;
      const bombBottom = bomb.y + bomb.h;

      const left = bombLeft - playerLeft;
      const right = bombRight - playerRight;
      const top = bombTop - playerTop;
      const bottom = bombBottom - playerBottom;

      // Si el jugador se ha movido fuera del rango de la bomba, desactivamos isNearBomb
      if (left <= -60 || right >= 60 || top >= 60 || bottom <= -60) {
        this.isNearBomb = false;
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
    const playerLeft = this.x;
    const playerRight = this.x + this.w;
    const playerTop = this.y;
    const playerBottom = this.y + this.h;
    this.bombsPlayer.forEach((bomb) => {
      if (this.collidesWithBomb()) {
        const bombLeft = bomb.x;
        const bombRight = bomb.x + bomb.w;
        const bombTop = bomb.y;
        const bombBottom = bomb.y + bomb.h;

        // Bloquear movimiento del jugador en función de la dirección de la bomba
        if (this.vx > 0 && playerLeft < bombLeft && playerRight > bombLeft) {
          this.vx = 0;
          this.x = bombLeft - this.w;
        } else if (
          this.vx < 0 &&
          playerRight > bombLeft &&
          this.x > bombRight
        ) {
          this.vx = 0;
          this.x = bombRight + 11;
        }
        // Si el jugador está moviéndose hacia abajo y colisiona con el lado superior del objeto
        else if (
          this.vy > 0 &&
          playerBottom > bombTop &&
          playerTop < bombTop &&
          playerRight > bombLeft &&
          playerLeft < bombRight
        ) {
          this.vy = 0;
          this.y = bombTop - this.h;
        }
        // Si el jugador está moviéndose hacia arriba y colisiona con el lado inferior del objeto
        else if (
          this.vy < 0 &&
          playerTop < bombBottom + 10 &&
          playerBottom > bombBottom + 10 &&
          playerRight > bombLeft &&
          playerLeft < bombRight
        ) {
          this.vy = 0;
          this.y = bombBottom + 10;
        }
      }
    });
  }

  onKeyDown(code) {
    switch (code) {
      case KEY_UP:
        this.vy = -this.speed;
        this.vx = 0;
        this.direction = "up";
        break;

      case KEY_DOWN:
        this.vy = this.speed;
        this.vx = 0;
        this.direction = "down";
        break;

      case KEY_RIGHT:
        this.vx = this.speed;
        this.vy = 0;
        this.direction = "right";
        break;

      case KEY_LEFT:
        this.vx = -this.speed;
        this.vy = 0;
        this.direction = "left";
        break;
      case KEY_SPACE:
        if (this.bombsPlayer.length === 0) {
          this.putBomb();
        }
        break;
    }
  }

  onKeyUp(code) {
    switch (code) {
      case KEY_UP:
      case KEY_DOWN:
        this.vy = 0;
        break;

      case KEY_RIGHT:
      case KEY_LEFT:
        this.vx = 0;
        break;
    }
    this.img.frameIndex = 0;
  }

  putBomb() {
    if (this.bombsPlayer.length === 0) {
      // Decidimos si la bomba va a la izquierda, derecha o abajo o arriba según la posición en la que se encuentra el jugador
      let bombX = Math.floor((this.x + 30) / 70) * 70;
      let bombY = Math.floor((this.y + this.h - 10) / 70) * 70;

      // Ponemos la bomba
      const bomb = new Bomb(
        this.ctx,
        bombX,
        bombY,
        this.destructible,
        this.box
      );
      this.bombsPlayer.push(bomb);
      this.isNearBomb = true;
    }
  }
}
