class Box {
  constructor(ctx) {
    this.ctx = ctx;
    this.w = 70;
    this.h = 70;

    this.img = new Image();
    this.img.frames = 2;
    this.img.src = "/assets/images/box.png";

    this.positions = [];
    this.initBoxes();
  }

  initBoxes() {
    const sectors = [
      { xMin: 0, xMax: 420, yMin: 0, yMax: 350 },
      { xMin: 420, xMax: 910, yMin: 0, yMax: 350 },
      { xMin: 0, xMax: 420, yMin: 350, yMax: 770 },
      { xMin: 420, xMax: 910, yMin: 350, yMax: 770 },
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
      // Camino de conexión entre jugadores para que no se queden encerrados
      // Columna 1
      { x: 0, y: 140 },
      { x: 0, y: 210 },
      { x: 0, y: 280 },
      { x: 0, y: 350 },
      { x: 0, y: 420 },
      { x: 0, y: 490 },
      { x: 0, y: 560 },
      // Columna 2
      { x: 70, y: 280 },
      { x: 70, y: 420 },
      // Columna 3
      { x: 140, y: 280 },
      { x: 140, y: 420 },
      // Columna 4
      { x: 210, y: 280 },
      { x: 210, y: 420 },
      // Columna 5
      { x: 280, y: 280 },
      { x: 280, y: 420 },
      // Columna 6
      { x: 350, y: 280 },
      { x: 350, y: 350 },
      { x: 350, y: 420 },
      // Columna 7
      { x: 420, y: 280 },
      { x: 420, y: 420 },
      // Columna 8
      { x: 490, y: 280 },
      { x: 490, y: 350 },
      { x: 490, y: 420 },
      // Columna 9
      { x: 560, y: 280 },
      { x: 560, y: 420 },
      // Columna 10
      { x: 630, y: 280 },
      { x: 630, y: 420 },
      // Columna 11
      { x: 700, y: 280 },
      { x: 700, y: 420 },
      // Columna 12
      { x: 770, y: 280 },
      { x: 770, y: 420 },
      // Columna 13
      { x: 840, y: 140 },
      { x: 840, y: 210 },
      { x: 840, y: 280 },
      { x: 840, y: 350 },
      { x: 840, y: 420 },
      { x: 840, y: 490 },
      { x: 840, y: 560 },
    ];

    // Distribuir 10 cajas en cada sector sin bloquear las posiciones prohibidas
    for (let sector of sectors) {
      let boxesInSector = 0;

      while (boxesInSector < 5) {
        let x =
          Math.floor(Math.random() * ((sector.xMax - sector.xMin) / 70)) * 70 +
          sector.xMin;
        let y =
          Math.floor(Math.random() * ((sector.yMax - sector.yMin) / 70)) * 70 +
          sector.yMin;

        // Verifica si la posición generada está en las posiciones prohibidas
        const isRestrictedPosition = restrictedPositions.some(
          (pos) => pos.x === x && pos.y === y
        );
        const isOccupied = this.positions.some(
          (pos) => pos.x === x && pos.y === y
        );

        if (isRestrictedPosition || isOccupied) continue;

        // Agrega la caja solo si no está en una posición prohibida
        let frameIndex = Math.floor(Math.random() * this.img.frames);
        this.positions.push({ x, y, frameIndex });
        boxesInSector++;
      }
    }
  }

  draw() {
    // Dibuja las cajas usando las posiciones almacenadas
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

  existsBoxAtPosition(x, y) {
    return this.positions.some((pos) => pos.x === x && pos.y === y);
  }
}
