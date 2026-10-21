import { getLang, onLangChange, t } from '../i18n/index.js';

/**
 * Módulo Didáctico e Interactivo de Redes Convolucionales (CNN) con Soporte Bilingüe
 */

export class CNNVisualizer {
  constructor(containerEl) {
    this.container = containerEl;
    this.selectedKernelKey = 'sobelX';
    this.currentScanX = 1;
    this.currentScanY = 1;
    this.isScanning = false;
    this.scanInterval = null;

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
        matrix: [
          [-1, 0, 1],
          [-2, 0, 2],
          [-1, 0, 1]
        ]
      },
      sobelY: {
        matrix: [
          [-1, -2, -1],
          [ 0,  0,  0],
          [ 1,  2,  1]
        ]
      },
      sharpen: {
        matrix: [
          [ 0, -1,  0],
          [-1,  5, -1],
          [ 0, -1,  0]
        ]
      },
      outline: {
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

    onLangChange(() => {
      this.initDOM();
      this.computeOutputs();
      this.render();
    });
  }

  getKernelName(key) {
    return t(`cnn.kernels.${key}.name`);
  }

  getKernelDesc(key) {
    return t(`cnn.kernels.${key}.desc`);
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="cnn-section">
        <div class="module-intro">
          <div class="intro-badge"><i class="fa-solid fa-eye"></i> ${t('cnn.badge')}</div>
          <h2>${t('cnn.title')}</h2>
          <p>${t('cnn.desc')}</p>
        </div>

        <div class="cnn-controls-bar">
          <div class="ctrl-group">
            <label>${t('cnn.selectFilter')}</label>
            <div class="kernel-chips" id="kernel-chips"></div>
          </div>
          <div class="cnn-actions">
            <button class="btn-primary" id="btn-scan-step">
              <i class="fa-solid fa-play"></i> <span id="btn-scan-text">${t('cnn.autoScan')}</span>
            </button>
            <button class="btn-secondary" id="btn-reset-scan">
              <i class="fa-solid fa-rotate-left"></i> ${t('cnn.resetPos')}
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
                <h3>${t('cnn.stage1Title')}</h3>
                <span class="stage-sub">${t('cnn.stage1Sub')}</span>
              </div>
            </div>
            <div class="matrix-canvas-wrapper">
              <canvas id="cnn-input-canvas" width="220" height="220"></canvas>
            </div>
            <div class="stage-legend">${t('cnn.stage1Legend')}</div>
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
                <h3>${t('cnn.stage2Title')}</h3>
                <span class="stage-sub">${t('cnn.stage2Sub')}</span>
              </div>
            </div>
            <div class="matrix-canvas-wrapper">
              <canvas id="cnn-fmap-canvas" width="220" height="220"></canvas>
            </div>
            <div class="stage-legend">${t('cnn.stage2Legend')}</div>
          </div>

          <!-- 3. Capa Max Pooling -->
          <div class="cnn-stage-card">
            <div class="stage-header">
              <span class="stage-num">3</span>
              <div>
                <h3>${t('cnn.stage3Title')}</h3>
                <span class="stage-sub">${t('cnn.stage3Sub')}</span>
              </div>
            </div>
            <div class="matrix-canvas-wrapper">
              <canvas id="cnn-pool-canvas" width="220" height="220"></canvas>
            </div>
            <div class="stage-legend">${t('cnn.stage3Legend')}</div>
          </div>
        </div>

        <!-- Desglose Matemático del píxel actual -->
        <div class="cnn-inspector-box" id="cnn-math-inspector">
          <div class="insp-title"><i class="fa-solid fa-calculator"></i> ${t('cnn.mathTitle')}</div>
          <div id="cnn-math-details" class="insp-details"></div>
        </div>
      </div>
    `;

    // Bind kernel chips
    const chipsContainer = this.container.querySelector('#kernel-chips');
    for (const [key] of Object.entries(this.kernels)) {
      const chip = document.createElement('button');
      chip.className = `kernel-chip ${key === this.selectedKernelKey ? 'active' : ''}`;
      chip.textContent = this.getKernelName(key);
      chip.addEventListener('click', () => {
        this.selectedKernelKey = key;
        chipsContainer.querySelectorAll('.kernel-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.computeOutputs();
        this.render();
      });
      chipsContainer.appendChild(chip);
    }

    // Bind auto-scan and reset
    this.container.querySelector('#btn-scan-step').addEventListener('click', () => this.toggleScan());
    this.container.querySelector('#btn-reset-scan').addEventListener('click', () => {
      this.currentScanX = 1;
      this.currentScanY = 1;
      this.render();
    });

    // Make canvas interactive on click
    const inCanvas = this.container.querySelector('#cnn-input-canvas');
    inCanvas.addEventListener('click', (e) => {
      const rect = inCanvas.getBoundingClientRect();
      const x = Math.floor(((e.clientX - rect.left) / rect.width) * 8);
      const y = Math.floor(((e.clientY - rect.top) / rect.height) * 8);
      // Mantener dentro del margen 3x3 válido
      this.currentScanX = Math.max(1, Math.min(6, x));
      this.currentScanY = Math.max(1, Math.min(6, y));
      this.render();
    });
  }

  toggleScan() {
    this.isScanning = !this.isScanning;
    const btn = this.container.querySelector('#btn-scan-step');
    const txt = this.container.querySelector('#btn-scan-text');

    if (this.isScanning) {
      txt.textContent = t('cnn.pauseScan');
      btn.classList.add('playing');
      this.scanInterval = setInterval(() => {
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
    } else {
      txt.textContent = t('cnn.autoScan');
      btn.classList.remove('playing');
      clearInterval(this.scanInterval);
    }
  }

  computeOutputs() {
    const k = this.kernels[this.selectedKernelKey].matrix;
    
    // Convolución 6x6
    this.featureMap = [];
    for (let y = 1; y <= 6; y++) {
      const row = [];
      for (let x = 1; x <= 6; x++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            sum += this.inputGrid[y + ky][x + kx] * k[ky + 1][kx + 1];
          }
        }
        row.push(Math.max(0, sum)); // ReLU
      }
      this.featureMap.push(row);
    }

    // Max Pooling 2x2 -> 3x3
    this.pooledMap = [];
    for (let py = 0; py < 6; py += 2) {
      const row = [];
      for (let px = 0; px < 6; px += 2) {
        const poolVal = Math.max(
          this.featureMap[py][px],
          this.featureMap[py][px + 1],
          this.featureMap[py + 1][px],
          this.featureMap[py + 1][px + 1]
        );
        row.push(poolVal);
      }
      this.pooledMap.push(row);
    }
  }

  render() {
    // 1. Actualizar descripción y matriz de Kernel
    const descEl = this.container.querySelector('#kernel-desc');
    if (descEl) descEl.textContent = this.getKernelDesc(this.selectedKernelKey);

    const kGrid = this.container.querySelector('#kernel-matrix-grid');
    if (kGrid) {
      const k = this.kernels[this.selectedKernelKey].matrix;
      kGrid.innerHTML = k.flat().map(v => `
        <div class="kernel-cell ${v > 0 ? 'pos' : (v < 0 ? 'neg' : 'zero')}">${v}</div>
      `).join('');
    }

    // 2. Dibujar Canvas de Entrada 8x8 con ventana de atención roja
    const inCanvas = this.container.querySelector('#cnn-input-canvas');
    if (!inCanvas) return;
    const inCtx = inCanvas.getContext('2d');
    const cellSize = inCanvas.width / 8;

    inCtx.clearRect(0, 0, inCanvas.width, inCanvas.height);
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const val = this.inputGrid[y][x];
        inCtx.fillStyle = `rgb(${val}, ${val}, ${val})`;
        inCtx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

        inCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        inCtx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }

    // Resaltar Receptive Field 3x3 actual
    const rfX = (this.currentScanX - 1) * cellSize;
    const rfY = (this.currentScanY - 1) * cellSize;
    inCtx.strokeStyle = '#00f2fe';
    inCtx.lineWidth = 3;
    inCtx.strokeRect(rfX, rfY, cellSize * 3, cellSize * 3);
    inCtx.fillStyle = 'rgba(0, 242, 254, 0.2)';
    inCtx.fillRect(rfX, rfY, cellSize * 3, cellSize * 3);

    // 3. Dibujar Mapa de Características 6x6
    const fCanvas = this.container.querySelector('#cnn-fmap-canvas');
    const fCtx = fCanvas.getContext('2d');
    const fCellSize = fCanvas.width / 6;

    fCtx.clearRect(0, 0, fCanvas.width, fCanvas.height);
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        const val = this.featureMap[y][x];
        const norm = Math.min(255, val / 4);
        fCtx.fillStyle = `rgb(${norm}, ${norm * 0.7}, ${norm * 1.2})`;
        fCtx.fillRect(x * fCellSize, y * fCellSize, fCellSize, fCellSize);

        fCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        fCtx.strokeRect(x * fCellSize, y * fCellSize, fCellSize, fCellSize);

        fCtx.fillStyle = norm > 130 ? '#04101e' : '#ffffff';
        fCtx.font = '10px monospace';
        fCtx.textAlign = 'center';
        fCtx.fillText(Math.round(val), x * fCellSize + fCellSize / 2, y * fCellSize + fCellSize / 2 + 3);
      }
    }

    // Resaltar píxel calculado actual
    const activeFX = (this.currentScanX - 1) * fCellSize;
    const activeFY = (this.currentScanY - 1) * fCellSize;
    fCtx.strokeStyle = '#ffd700';
    fCtx.lineWidth = 3;
    fCtx.strokeRect(activeFX, activeFY, fCellSize, fCellSize);

    // 4. Dibujar Max Pooling 3x3
    const pCanvas = this.container.querySelector('#cnn-pool-canvas');
    const pCtx = pCanvas.getContext('2d');
    const pCellSize = pCanvas.width / 3;

    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        const val = this.pooledMap[y][x];
        const norm = Math.min(255, val / 4);
        pCtx.fillStyle = `rgb(${norm * 0.5}, ${norm * 0.9}, ${norm})`;
        pCtx.fillRect(x * pCellSize, y * pCellSize, pCellSize, pCellSize);

        pCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        pCtx.strokeRect(x * pCellSize, y * pCellSize, pCellSize, pCellSize);

        pCtx.fillStyle = norm > 130 ? '#04101e' : '#ffffff';
        pCtx.font = '12px monospace';
        pCtx.textAlign = 'center';
        pCtx.fillText(Math.round(val), x * pCellSize + pCellSize / 2, y * pCellSize + pCellSize / 2 + 4);
      }
    }

    // 5. Detalle Matemático del Producto Punto
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
    const isEn = getLang() === 'en';

    if (detailsEl) {
      detailsEl.innerHTML = `
        <div class="math-line">
          <span>${isEn ? 'Dot Product:' : 'Producto Punto:'}</span> 
          <code>∑ (${isEn ? 'Pixel' : 'Píxel'} &times; Kernel) = ${terms.slice(0, 5).join(' + ')} ... = <strong>${sum}</strong></code>
        </div>
        <div class="math-line">
          <span>${isEn ? 'ReLU Function:' : 'Función ReLU:'}</span> 
          <code>max(0, ${sum}) = <strong class="res-num">${activated}</strong></code>
          <span class="math-tag">${isEn ? `Stored in Feature Map at position (${cx}, ${cy})` : `Valor almacenado en el Feature Map en posición (${cx}, ${cy})`}</span>
        </div>
      `;
    }
  }
}
