class Laser {
  constructor(ctx, x, y, colisions, rotation) {
    this.ctx = ctx;
    this.w = 70;
    this.h = 70;
    this.x = x;
    this.y = y;
    this.colisions = colisions;
    this.rotation = rotation;

    this.img = new Image();
    this.img.frames = 4;
    this.img.frameIndex = 0;
    this.img.src = "/assets/images/laser.png";

    this.frameWidth = 70.43;
    this.frameHeight = 70;
    this.tickLaser = 0;
    this.tickLaserDuration = 100;
  }

  draw() {
    this.tickLaser++;
    let row;

    if (this.colisions === 4) {
      this.img.frameIndex = 3;
      row = 0;
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
    } else if (this.colisions === 1) {
      this.img.frameIndex = 3;
      row = 1;

      this.ctx.save();
      this.ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
      this.ctx.rotate((this.rotation * Math.PI) / 180); // Rota según el ángulo

      this.ctx.drawImage(
        this.img,
        this.img.frameIndex * this.frameWidth,
        row * this.frameHeight,
        this.frameWidth,
        this.frameHeight,
        -this.w / 2,
        -this.h / 2,
        this.w,
        this.h
      );

      this.ctx.restore();
    }
  }

  hasDisappeared() {
    return this.tickLaser >= this.tickLaserDuration;
  }
}
