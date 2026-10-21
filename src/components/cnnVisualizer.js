/**
 * Módulo Didáctico e Interactivo de Redes Convolucionales (CNN)
 * Permite explorar cómo la visión por computadora detecta bordes, texturas
 * y patrones mediante convolución (Kernels 3x3), ReLU y Max Pooling.
 */

export class CNNVisualizer {
  constructor(containerEl) {
    this.container = containerEl;
    this.selectedKernelKey = 'sobelX';
    this.currentScanX = 1;
    this.currentScanY = 1;
    this.isScanning = false;

    // Imagen de prueba de 8x8 píxeles representando una anomalía médica / pieza industrial
    this.inputGrid = [
      [10, 15, 20, 20, 25, 20, 15, 10],
      [15, 20, 90, 95, 95, 90, 20, 15],
      [20, 90, 230, 240, 240, 230, 90, 20],
      [20, 95, 240, 255, 255, 240, 95, 20],
      [25, 95, 240, 255, 255, 240, 95, 25],
      [20, 90, 230, 240, 240, 230, 90, 20],
      [15, 20, 90, 95, 95, 90, 20, 15],
      [10, 15, 20, 20, 25, 20, 15, 10]
    ];

    this.kernels = {
      sobelX: {
        name: 'Bordes Verticales (Sobel X)',
        desc: 'Detecta transiciones bruscas de luz de izquierda a derecha (bordes verticales de fracturas o piezas).',
        matrix: [
          [-1, 0, 1],
          [-2, 0, 2],
          [-1, 0, 1]
        ]
      },
      sobelY: {
        name: 'Bordes Horizontales (Sobel Y)',
        desc: 'Detecta transiciones bruscas de luz de arriba a abajo (superficies horizontales).',
        matrix: [
          [-1, -2, -1],
          [ 0,  0,  0],
          [ 1,  2,  1]
        ]
      },
      sharpen: {
        name: 'Realce de Detalles (Sharpen)',
        desc: 'Acentúa el contraste de los centros respecto a su entorno para aislar micro-defectos.',
        matrix: [
          [ 0, -1,  0],
          [-1,  5, -1],
          [ 0, -1,  0]
        ]
      },
      outline: {
        name: 'Detector Laplaciano (Contornos)',
        desc: 'Filtro omnidireccional que aísla el contorno completo de cualquier objeto.',
        matrix: [
          [-1, -1, -1],
          [-1,  8, -1],
          [-1, -1, -1]
        ]
      }
    };

    this.initDOM();
    this.computeOutputs();
    this.render();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="cnn-section">
        <div class="module-intro">
          <div class="intro-badge"><i class="fa-solid fa-eye"></i> Visión por Computadora</div>
          <h2>¿Cómo ve el mundo una Red Neuronal Convolucional (CNN)?</h2>
          <p>
            A diferencia de las redes densas (MLP) que tratan cada píxel como un número aislado perdiendo la noción de espacio,
            las <strong>CNN</strong> usan pequeños filtros deslizantes llamados <strong>Kernels</strong> para escanear la imagen
            y extraer bordes, curvas y texturas, sin importar dónde aparezcan.
          </p>
        </div>

        <div class="cnn-controls-bar">
          <div class="ctrl-group">
            <label>Seleccionar Filtro (Kernel 3&times;3):</label>
            <div class="kernel-chips" id="kernel-chips"></div>
          </div>
          <div class="cnn-actions">
            <button class="btn-primary" id="btn-scan-step">
              <i class="fa-solid fa-play"></i> Auto-Escanear
            </button>
            <button class="btn-secondary" id="btn-reset-scan">
              <i class="fa-solid fa-rotate-left"></i> Reiniciar Posición
            </button>
          </div>
        </div>

        <p class="kernel-description" id="kernel-desc"></p>

        <div class="cnn-pipeline-grid">
          <!-- 1. Imagen de Entrada -->
          <div class="cnn-stage-card">
            <div class="stage-header">
              <span class="stage-num">1</span>
              <div>
                <h3>Imagen de Entrada</h3>
                <span class="stage-sub">8&times;8 Píxeles (Escala de Grises)</span>
              </div>
            </div>
            <div class="matrix-canvas-wrapper">
              <canvas id="cnn-input-canvas" width="220" height="220"></canvas>
            </div>
            <div class="stage-legend">Muestra una radiografía simulada con un nódulo central.</div>
          </div>

          <!-- Operador Convolución y Kernel -->
          <div class="cnn-math-connector">
            <div class="op-symbol">&circledast;</div>
            <div class="kernel-box-preview">
              <div class="kernel-mini-title">Kernel 3&times;3</div>
              <div id="kernel-matrix-grid" class="kernel-matrix-grid"></div>
            </div>
            <i class="fa-solid fa-arrow-right cnn-arrow"></i>
          </div>

          <!-- 2. Mapa de Características (Feature Map) -->
          <div class="cnn-stage-card">
            <div class="stage-header">
              <span class="stage-num">2</span>
              <div>
                <h3>Mapa de Características</h3>
                <span class="stage-sub">6&times;6 Convolución + ReLU</span>
              </div>
            </div>
            <div class="matrix-canvas-wrapper">
              <canvas id="cnn-fmap-canvas" width="220" height="220"></canvas>
            </div>
            <div class="stage-legend">Resalta las zonas donde el filtro coincide con la imagen.</div>
          </div>

          <!-- 3. Capa Max Pooling -->
          <div class="cnn-stage-card">
            <div class="stage-header">
              <span class="stage-num">3</span>
              <div>
                <h3>Max Pooling (2&times;2)</h3>
                <span class="stage-sub">3&times;3 Reducción Espacial</span>
              </div>
            </div>
            <div class="matrix-canvas-wrapper">
              <canvas id="cnn-pool-canvas" width="220" height="220"></canvas>
            </div>
            <div class="stage-legend">Reduce a la mitad el tamaño quedándose con el rasgo más fuerte.</div>
          </div>
        </div>

        <!-- Desglose Matemático del píxel actual -->
        <div class="cnn-inspector-box" id="cnn-math-inspector">
          <div class="insp-title"><i class="fa-solid fa-calculator"></i> Cálculo del Producto Convolucional en la posición actual:</div>
          <div id="cnn-math-details" class="insp-details"></div>
        </div>
      </div>
    `;

    // Bind kernel chips
    const chipsContainer = this.container.querySelector('#kernel-chips');
    for (const [key, k] of Object.entries(this.kernels)) {
      const chip = document.createElement('button');
      chip.className = `kernel-chip ${key === this.selectedKernelKey ? 'active' : ''}`;
      chip.textContent = k.name;
      chip.addEventListener('click', () => {
        this.selectedKernelKey = key;
        chipsContainer.querySelectorAll('.kernel-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.computeOutputs();
        this.render();
      });
      chipsContainer.appendChild(chip);
    }

    // Bind scan buttons
    this.container.querySelector('#btn-scan-step').addEventListener('click', () => {
      this.toggleAutoScan();
    });
    this.container.querySelector('#btn-reset-scan').addEventListener('click', () => {
      this.stopAutoScan();
      this.currentScanX = 1;
      this.currentScanY = 1;
      this.render();
    });

    // Clic en canvas de entrada para mover el receptive field
    const inCanvas = this.container.querySelector('#cnn-input-canvas');
    inCanvas.addEventListener('click', (e) => {
      const rect = inCanvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const cellSize = inCanvas.width / 8;
      const gx = Math.floor(px / cellSize);
      const gy = Math.floor(py / cellSize);
      
      // Asegurar que la ventana 3x3 no se salga
      this.currentScanX = Math.max(1, Math.min(6, gx));
      this.currentScanY = Math.max(1, Math.min(6, gy));
      this.render();
    });
  }

  computeOutputs() {
    const k = this.kernels[this.selectedKernelKey].matrix;
    const img = this.inputGrid;
    const fMap = [];

    // Convolución 3x3 válida -> resultado 6x6
    for (let y = 1; y < 7; y++) {
      const row = [];
      for (let x = 1; x < 7; x++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            sum += img[y + ky][x + kx] * k[ky + 1][kx + 1];
          }
        }
        // Activación ReLU
        const activated = Math.max(0, sum);
        row.push(activated);
      }
      fMap.push(row);
    }
    this.featureMap = fMap;

    // Max Pooling 2x2 sobre el fMap 6x6 -> resultado 3x3
    const pool = [];
    for (let py = 0; py < 6; py += 2) {
      const pRow = [];
      for (let px = 0; px < 6; px += 2) {
        const val1 = fMap[py][px];
        const val2 = fMap[py][px + 1];
        const val3 = fMap[py + 1][px];
        const val4 = fMap[py + 1][px + 1];
        pRow.push(Math.max(val1, val2, val3, val4));
      }
      pool.push(pRow);
    }
    this.poolMap = pool;
  }

  toggleAutoScan() {
    if (this.isScanning) {
      this.stopAutoScan();
    } else {
      this.isScanning = true;
      const btn = this.container.querySelector('#btn-scan-step');
      btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pausar Escaneo`;
      btn.classList.add('btn-warning');

      this.scanTimer = setInterval(() => {
        this.currentScanX++;
        if (this.currentScanX > 6) {
          this.currentScanX = 1;
          this.currentScanY++;
          if (this.currentScanY > 6) {
            this.currentScanY = 1;
          }
        }
        this.render();
      }, 350);
    }
  }

  stopAutoScan() {
    this.isScanning = false;
    clearInterval(this.scanTimer);
    const btn = this.container.querySelector('#btn-scan-step');
    btn.innerHTML = `<i class="fa-solid fa-play"></i> Auto-Escanear`;
    btn.classList.remove('btn-warning');
  }

  render() {
    const curKernel = this.kernels[this.selectedKernelKey];
    this.container.querySelector('#kernel-desc').innerHTML = `
      <strong>${curKernel.name}:</strong> ${curKernel.desc}
    `;

    // Renderizar matriz visual del Kernel 3x3
    const kGrid = this.container.querySelector('#kernel-matrix-grid');
    kGrid.innerHTML = '';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const val = curKernel.matrix[r][c];
        const cell = document.createElement('div');
        cell.className = `k-cell ${val > 0 ? 'pos' : (val < 0 ? 'neg' : 'zero')}`;
        cell.textContent = val;
        kGrid.appendChild(cell);
      }
    }

    // 1. Dibujar Imagen de Entrada (8x8) con el Receptive Field resaltado
    const inCanvas = this.container.querySelector('#cnn-input-canvas');
    const inCtx = inCanvas.getContext('2d');
    const inCellSize = inCanvas.width / 8;

    inCtx.clearRect(0, 0, inCanvas.width, inCanvas.height);
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const val = this.inputGrid[y][x];
        inCtx.fillStyle = `rgb(${val}, ${val}, ${val})`;
        inCtx.fillRect(x * inCellSize, y * inCellSize, inCellSize, inCellSize);
        inCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        inCtx.strokeRect(x * inCellSize, y * inCellSize, inCellSize, inCellSize);
      }
    }

    // Resaltar Ventana 3x3 Receptive Field
    const sx = (this.currentScanX - 1) * inCellSize;
    const sy = (this.currentScanY - 1) * inCellSize;
    inCtx.strokeStyle = '#00f2fe';
    inCtx.lineWidth = 3;
    inCtx.strokeRect(sx, sy, inCellSize * 3, inCellSize * 3);
    inCtx.fillStyle = 'rgba(0, 242, 254, 0.2)';
    inCtx.fillRect(sx, sy, inCellSize * 3, inCellSize * 3);

    // 2. Dibujar Mapa de Características (6x6)
    const fCanvas = this.container.querySelector('#cnn-fmap-canvas');
    const fCtx = fCanvas.getContext('2d');
    const fCellSize = fCanvas.width / 6;

    // Encontrar max en fMap para normalizar brillo
    let maxF = 1;
    for (const row of this.featureMap) {
      for (const v of row) if (v > maxF) maxF = v;
    }

    fCtx.clearRect(0, 0, fCanvas.width, fCanvas.height);
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        const val = this.featureMap[y][x];
        const norm = Math.min(255, Math.round((val / maxF) * 255));
        fCtx.fillStyle = `rgb(${norm}, ${Math.round(norm * 0.9)}, ${Math.round(norm * 0.4)})`;
        fCtx.fillRect(x * fCellSize, y * fCellSize, fCellSize, fCellSize);
        fCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        fCtx.strokeRect(x * fCellSize, y * fCellSize, fCellSize, fCellSize);
      }
    }

    // Resaltar píxel calculado actual en Feature Map (currentScanX - 1, currentScanY - 1)
    const curFx = (this.currentScanX - 1) * fCellSize;
    const curFy = (this.currentScanY - 1) * fCellSize;
    fCtx.strokeStyle = '#f59e0b';
    fCtx.lineWidth = 2.5;
    fCtx.strokeRect(curFx, curFy, fCellSize, fCellSize);

    // 3. Dibujar Max Pooling (3x3)
    const pCanvas = this.container.querySelector('#cnn-pool-canvas');
    const pCtx = pCanvas.getContext('2d');
    const pCellSize = pCanvas.width / 3;

    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const val = this.poolMap[y][x];
        const norm = Math.min(255, Math.round((val / maxF) * 255));
        pCtx.fillStyle = `rgb(${Math.round(norm * 0.3)}, ${norm}, ${Math.round(norm * 0.8)})`;
        pCtx.fillRect(x * pCellSize, y * pCellSize, pCellSize, pCellSize);
        pCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        pCtx.strokeRect(x * pCellSize, y * pCellSize, pCellSize, pCellSize);

        pCtx.fillStyle = '#ffffff';
        pCtx.font = '11px sans-serif';
        pCtx.textAlign = 'center';
        pCtx.fillText(Math.round(val), x * pCellSize + pCellSize / 2, y * pCellSize + pCellSize / 2 + 4);
      }
    }

    // 4. Detalle Matemático del Producto Punto
    this.renderMathDetails();
  }

  renderMathDetails() {
    const k = this.kernels[this.selectedKernelKey].matrix;
    const cy = this.currentScanY;
    const cx = this.currentScanX;
    let sum = 0;
    let terms = [];

    for (let ky = -1; ky <= 1; ky++) {
      for (let kx = -1; kx <= 1; kx++) {
        const pVal = this.inputGrid[cy + ky][cx + kx];
        const kVal = k[ky + 1][kx + 1];
        const term = pVal * kVal;
        sum += term;
        if (kVal !== 0) {
          terms.push(`(${pVal} &times; ${kVal})`);
        }
      }
    }

    const activated = Math.max(0, sum);
    const detailsEl = this.container.querySelector('#cnn-math-details');
    detailsEl.innerHTML = `
      <div class="math-line">
        <span>Producto Punto:</span> 
        <code>∑ (Píxel &times; Kernel) = ${terms.slice(0, 5).join(' + ')} ... = <strong>${sum}</strong></code>
      </div>
      <div class="math-line">
        <span>Función ReLU:</span> 
        <code>max(0, ${sum}) = <strong class="res-num">${activated}</strong></code>
        <span class="math-tag">Valor almacenado en el Feature Map en posición (${cx}, ${cy})</span>
      </div>
    `;
  }
}
