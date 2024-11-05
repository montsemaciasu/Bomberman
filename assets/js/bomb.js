class Bomb {
  constructor(ctx, x, y, destructible, box, player, enemy) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.destructible = destructible;
    this.box = box;
    this.player = player;
    this.enemy = enemy;

    this.w = 50;
    this.h = 60;

    this.img = new Image();
    this.img.frames = 6;
    this.img.frameIndex = 0;
    this.img.src = "/assets/images/bomb.png";

    this.frameWidth = 66;
    this.frameHeight = 100;

    this.tickBomb = 0;
    this.isVisible = true;
    this.exploded = false;
    this.ticksToDisappear = 250;

    this.explosions = [];
    this.lasers = [];
  }

  draw() {
    this.tickBomb++;

    // Si ya ha pasado el tiempo que se ha dibujado, que "explote"
    if (this.tickBomb >= this.ticksToDisappear && !this.exploded) {
      this.isVisible = false;
      this.explote();
      this.exploded = true;
    }

    this.explosions.forEach((explosion, index) => {
      explosion.draw();
      if (explosion.hasDisappeared()) {
        this.explosions.splice(index, 1);
      }
    });

    // Dibuja los láseres
    this.lasers.forEach((laser, index) => {
      laser.draw();
      if (laser.hasDisappeared()) {
        this.lasers.splice(index, 1);
      }
    });

    // Dibuja la bomba solo si sigue siendo visible
    if (this.isVisible) {
      if (this.tickBomb < 60) {
        this.img.frameIndex = Math.floor(this.tickBomb / 30) % 2;
      } else if (this.tickBomb < 120) {
        this.img.frameIndex = 4;
      } else if (this.tickBomb < 140) {
        this.img.frameIndex = 3;
      } else if (this.tickBomb < this.ticksToDisappear) {
        this.img.frameIndex = 2;
      } else {
        this.isVisible = false;
      }

      this.ctx.drawImage(
        this.img,
        this.img.frameIndex * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight,
        this.x + 13,
        this.y + 20,
        this.w,
        this.h
      );
    }
  }

  hasLaserDisappeared() {
    return this.lasers.every((laser) => laser.hasDisappeared());
  }
  hasDisappeared() {
    return (
      this.tickBomb >= this.ticksToDisappear + 150 && // Extiende el tiempo para mostrar el láser
      this.explosions.length === 0 &&
      this.lasers.length === 0
    );
  }

  explote() {
    const destructibleSize = 70;
    const positionsToCheck = [
      { x: this.x, y: this.y - destructibleSize, rotation: "down" }, // abajo
      { x: this.x, y: this.y + destructibleSize, rotation: "up" }, // arriba
      { x: this.x - destructibleSize, y: this.y, rotation: "left" }, // izquierda
      { x: this.x + destructibleSize, y: this.y, rotation: "right" }, // derecha
    ];

    let nonCollisionDirections = []; // Guarda direcciones sin colisiones

    positionsToCheck.forEach((pos) => {
      let collisions = 0;

      // Comprueba colisiones con otros objetos alrededor
      if (this.destructible.existsDestructibleAtPosition(pos.x, pos.y)) {
        collisions++;
        this.destructible.removeDestructibleAtPosition(pos.x, pos.y);
        const explosion = new Explosion(this.ctx, pos.x, pos.y);
        this.explosions.push(explosion);
      }

      if (this.box.existsBoxAtPosition(pos.x, pos.y)) {
        collisions++;
      }

      // Si no hay colisiones, agrega la dirección a nonCollisionDirections
      if (collisions === 0) {
        nonCollisionDirections.push(pos);
      }
    });

    // Agrega un láser en la posición de la bomba (centro) con rotación 0
    const laserCenter = new Laser(this.ctx, this.x, this.y, 4, 0);
    this.lasers.push(laserCenter);

    // Dibuja láseres en las posiciones sin colisiones con su respectiva rotación
    nonCollisionDirections.forEach((pos) => {
      if (pos.rotation === "left") {
        const laser = new Laser(this.ctx, pos.x, pos.y, 1, 180,); // pasa rotación desde `pos.rotation`
        this.lasers.push(laser);
      }
      if (pos.rotation === "right") {
        const laser = new Laser(this.ctx, pos.x, pos.y, 1, 0); // pasa rotación desde `pos.rotation`
        this.lasers.push(laser);
      }
      if (pos.rotation === "up") {
        const laser = new Laser(this.ctx, pos.x, pos.y, 1, 90); // pasa rotación desde `pos.rotation`
        this.lasers.push(laser);
      }
      if (pos.rotation === "down") {
        const laser = new Laser(this.ctx, pos.x, pos.y, 1, 270); // pasa rotación desde `pos.rotation`
        this.lasers.push(laser);
      }
    });
  }
}
