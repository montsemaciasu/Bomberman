class Destructible {
  constructor(ctx, boxPositions) {
    this.ctx = ctx;
    this.w = 70;
    this.h = 70;

    this.img = new Image();
    this.img.frames = 3;
    this.img.src = "/assets/images/destructibles.png";

    this.positions = [];
    this.boxPositions = boxPositions; // Almacena las posiciones de las cajas de Box
    this.initDestructibles();
  }

  initDestructibles() {
    const sectors = [
      { xMin: 0, xMax: 420, yMin: 0, yMax: 350 }, // Sector 1
      { xMin: 420, xMax: 910, yMin: 0, yMax: 350 }, // Sector 2
      { xMin: 0, xMax: 420, yMin: 350, yMax: 770 }, // Sector 3
      { xMin: 420, xMax: 910, yMin: 350, yMax: 770 }, // Sector 4
    ];

    // Coordenadas específicas de posiciones prohibidas
    const restrictedPositions = [
      // Posición jugador 1
      { x: 0, y: 0 },
      { x: 70, y: 0 },
      { x: 0, y: 70 },
      // Posición jugador 2
      { x: 770, y: 0 },
      { x: 840, y: 0 },
      { x: 840, y: 70 },
      // Posición jugador 3
      { x: 0, y: 630 },
      { x: 0, y: 700 },
      { x: 70, y: 700 },
      // Posición jugador 4
      { x: 770, y: 700 },
      { x: 840, y: 630 },
      { x: 840, y: 700 },
    ];

    // Distribuir 10 cajas en cada sector sin bloquear las posiciones prohibidas ni solaparse
    for (let sector of sectors) {
      let boxesInSector = 0;

      while (boxesInSector < 5) {
        let x =
          Math.floor(Math.random() * ((sector.xMax - sector.xMin) / 70)) * 70 +
          sector.xMin;
        let y =
          Math.floor(Math.random() * ((sector.yMax - sector.yMin) / 70)) * 70 +
          sector.yMin;

        const isRestrictedPosition = restrictedPositions.some(
          (pos) => pos.x === x && pos.y === y
        );
        const isOccupied = this.positions.some(
          (pos) => pos.x === x && pos.y === y
        );
        const hasBox = this.boxPositions.some(
          (pos) => pos.x === x && pos.y === y
        );

        if (isRestrictedPosition || isOccupied || hasBox) continue;

        let frameIndex = Math.floor(Math.random() * this.img.frames);
        this.positions.push({ x, y, frameIndex });
        boxesInSector++;
      }
    }
  }

  draw() {
    // Dibuja los objetos usando las posiciones almacenadas
    this.positions.forEach((pos) => {
      this.ctx.drawImage(
        this.img,
        (pos.frameIndex / this.img.frames) * this.img.width,
        0,
        this.img.width / this.img.frames,
        this.img.height,
        pos.x,
        pos.y,
        this.w,
        this.h
      );
    });
  }

  existsDestructibleAtPosition(x, y) {
    return this.positions.some((pos) => pos.x === x && pos.y === y);
  }

  removeDestructibleAtPosition(x, y) {
    this.positions = this.positions.filter((pos) => pos.x !== x || pos.y !== y);
  }
}
