class Explosion {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.w = 70;
    this.h = 70;
    this.x = x;
    this.y = y;

    this.img = new Image();
    this.img.frames = 4; // Suponiendo 4 frames para la animación de la explosión
    this.img.frameIndex = 0;
    this.img.src = "/assets/images/laser.png";

    this.frameWidth = 70;
    this.frameHeight = 70;
    this.tickExplosion = 0;
    this.explosionDuration = 25; // Duración de la explosión en ticks
  }

  draw() {
    this.tickExplosion++;
    const row = 3;

    if (this.tickExplosion < 5) {
      this.img.frameIndex = 0;
    } else if (this.tickExplosion < 10) {
      this.img.frameIndex = 1;
    } else if (this.tickExplosion < 15) {
      this.img.frameIndex = 2;
    } else if (this.tickExplosion < 20) {
      this.img.frameIndex = 2;
    } else if (this.tickExplosion < this.explosionDuration) {
      this.img.frameIndex = 3;
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

  hasDisappeared() {
    return this.tickExplosion >= this.explosionDuration;
  }
}
