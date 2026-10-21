/**
 * Visualizador de Frontera de Decisión 2D (Decision Boundary Heatmap)
 * Renderiza el espacio de predicción continua, los puntos de datos reales con unidades de dominio,
 * y permite interactuar haciendo clic para evaluar casos de prueba personalizados en tiempo real.
 */

export class DecisionBoundaryVisualizer {
  constructor(containerEl, onCustomProbeClick) {
    this.container = containerEl;
    this.onCustomProbeClick = onCustomProbeClick;
    this.showTestData = true;
    this.discretize = false;
    this.customProbe = null; // { x1, x2, realX1, realX2, pred }
    this.hoveredPoint = null;

    this.gridResolution = 55; // 55x55 grid for crisp 60fps rendering
    this.initDOM();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="decision-boundary-wrapper">
        <div class="boundary-header">
          <div class="boundary-title">
            <i class="fa-solid fa-chart-area"></i>
            <span>Frontera de Decisión en Vivo</span>
          </div>
          <div class="boundary-actions">
            <label class="toggle-control" title="Mostrar/ocultar puntos de evaluación (test)">
              <input type="checkbox" id="chk-show-test" checked>
              <span class="toggle-slider"></span>
              <span class="toggle-text">Datos Test</span>
            </label>
            <label class="toggle-control" title="Ver frontera nítida al 50% de probabilidad">
              <input type="checkbox" id="chk-discretize">
              <span class="toggle-slider"></span>
              <span class="toggle-text">Discretizar</span>
            </label>
          </div>
        </div>

        <div class="canvas-boundary-relative">
          <canvas id="boundary-canvas" width="380" height="380"></canvas>
          <div id="boundary-tooltip" class="boundary-tooltip"></div>
          <div id="probe-card" class="probe-card" style="display: none;"></div>
        </div>

        <div class="axis-labels">
          <div class="axis-x-label" id="axis-x-title">Característica X₁ (Eje horizontal)</div>
          <div class="axis-y-label" id="axis-y-title">Característica X₂ (Eje vertical)</div>
        </div>

        <div class="boundary-footer-stats">
          <div class="stat-pill">
            <span class="stat-label">Loss Entrenamiento:</span>
            <span class="stat-val" id="metric-train-loss">0.000</span>
          </div>
          <div class="stat-pill">
            <span class="stat-label">Loss Test:</span>
            <span class="stat-val" id="metric-test-loss">0.000</span>
          </div>
          <div class="stat-pill highlight">
            <span class="stat-label">Precisión (Test Acc):</span>
            <span class="stat-val" id="metric-test-acc">0.0%</span>
          </div>
        </div>
      </div>
    `;

    this.canvas = this.container.querySelector('#boundary-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.tooltip = this.container.querySelector('#boundary-tooltip');
    this.probeCard = this.container.querySelector('#probe-card');
    this.axisXTitle = this.container.querySelector('#axis-x-title');
    this.axisYTitle = this.container.querySelector('#axis-y-title');

    this.trainLossEl = this.container.querySelector('#metric-train-loss');
    this.testLossEl = this.container.querySelector('#metric-test-loss');
    this.testAccEl = this.container.querySelector('#metric-test-acc');

    // Toggles
    this.container.querySelector('#chk-show-test').addEventListener('change', (e) => {
      this.showTestData = e.target.checked;
      this.renderCurrent();
    });

    this.container.querySelector('#chk-discretize').addEventListener('change', (e) => {
      this.discretize = e.target.checked;
      this.renderCurrent();
    });

    // Interacción de Canvas
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('mouseleave', () => {
      this.tooltip.style.display = 'none';
      this.hoveredPoint = null;
    });
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
  }

  handleCanvasClick(e) {
    if (!this.lastNetwork || !this.lastProblem) return;
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    // Convertir de px canvas a rango [-1, 1]
    const x1 = (px / this.canvas.width) * 2 - 1;
    const x2 = -((py / this.canvas.height) * 2 - 1); // Y invertido

    const pred = this.lastNetwork.forward(this.lastNetwork.extractFeatures({ x1, x2 }));

    // Desnormalizar a unidades reales
    const f1 = this.lastProblem.feature1;
    const f2 = this.lastProblem.feature2;
    const realX1 = Math.round(f1.min + ((x1 + 1) / 2) * (f1.max - f1.min));
    const realX2 = Number((f2.min + ((x2 + 1) / 2) * (f2.max - f2.min)).toFixed(1));

    this.customProbe = { px, py, x1, x2, realX1, realX2, pred };

    // Mostrar tarjeta de prueba
    this.showProbeCard(this.customProbe);
    this.renderCurrent();
    if (this.onCustomProbeClick) this.onCustomProbeClick(this.customProbe);
  }

  showProbeCard(probe) {
    const p1Name = this.lastProblem.feature1.name;
    const p1Unit = this.lastProblem.feature1.unit;
    const p2Name = this.lastProblem.feature2.name;
    const p2Unit = this.lastProblem.feature2.unit;

    const isClass1 = probe.pred >= 0.5;
    const classInfo = isClass1 ? this.lastProblem.classes[1] : this.lastProblem.classes[0];
    const confidence = Math.round(isClass1 ? probe.pred * 100 : (1 - probe.pred) * 100);

    this.probeCard.style.display = 'block';
    this.probeCard.innerHTML = `
      <div class="probe-card-header">
        <span class="badge-probe"><i class="fa-solid fa-bullseye"></i> Caso de Prueba Personalizado</span>
        <button class="btn-close-probe" id="btn-close-probe">&times;</button>
      </div>
      <div class="probe-body">
        <div class="probe-field"><strong>${p1Name}:</strong> ${probe.realX1} ${p1Unit}</div>
        <div class="probe-field"><strong>${p2Name}:</strong> ${probe.realX2} ${p2Unit}</div>
        <div class="probe-prediction" style="border-left: 3px solid ${classInfo.color};">
          <div class="pred-label">Predicción de la Red:</div>
          <div class="pred-val" style="color: ${classInfo.color};">${classInfo.symbol} ${classInfo.label} (${confidence}%)</div>
        </div>
      </div>
    `;

    this.probeCard.querySelector('#btn-close-probe').addEventListener('click', () => {
      this.probeCard.style.display = 'none';
      this.customProbe = null;
      this.renderCurrent();
    });
  }

  handleMouseMove(e) {
    if (!this.lastTrainData) return;
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Buscar punto más cercano
    const allPoints = [...this.lastTrainData, ...(this.showTestData ? (this.lastTestData || []) : [])];
    let closest = null;
    let minDist = 12; // radio de detección px

    for (const pt of allPoints) {
      const px = ((pt.x1 + 1) / 2) * this.canvas.width;
      const py = ((-pt.x2 + 1) / 2) * this.canvas.height;
      const dist = Math.hypot(mx - px, my - py);
      if (dist < minDist) {
        minDist = dist;
        closest = { ...pt, px, py };
      }
    }

    if (closest) {
      this.hoveredPoint = closest;
      const isClass1 = closest.label === 1;
      const cls = this.lastProblem.classes[isClass1 ? 1 : 0];
      const isTest = this.lastTestData && this.lastTestData.includes(closest);

      this.tooltip.style.display = 'block';
      this.tooltip.innerHTML = `
        <div class="tt-header">
          <span>${cls.symbol} ${cls.label}</span>
          <span class="tt-badge ${isTest ? 'test-badge' : 'train-badge'}">${isTest ? 'Datos Test' : 'Datos Train'}</span>
        </div>
        <div class="tt-desc">${closest.info}</div>
      `;
      this.tooltip.style.left = `${Math.min(mx + 15, this.canvas.width - 170)}px`;
      this.tooltip.style.top = `${Math.max(10, my - 45)}px`;
    } else {
      this.hoveredPoint = null;
      this.tooltip.style.display = 'none';
    }
  }

  renderCurrent() {
    if (this.lastNetwork && this.lastProblem) {
      this.render(this.lastNetwork, this.lastProblem, this.lastTrainData, this.lastTestData);
    }
  }

  render(network, problem, trainData, testData) {
    this.lastNetwork = network;
    this.lastProblem = problem;
    this.lastTrainData = trainData;
    this.lastTestData = testData;

    // Actualizar etiquetas de ejes
    if (problem.feature1 && problem.feature2) {
      this.axisXTitle.innerHTML = `<strong>${problem.feature1.name}</strong> (${problem.feature1.unit})`;
      this.axisYTitle.innerHTML = `<strong>${problem.feature2.name}</strong> (${problem.feature2.unit})`;
    }

    // Actualizar métricas
    this.trainLossEl.textContent = network.trainLoss !== undefined ? network.trainLoss.toFixed(4) : '0.000';
    this.testLossEl.textContent = network.testLoss !== undefined ? network.testLoss.toFixed(4) : '0.000';
    this.testAccEl.textContent = network.testAccuracy !== undefined ? `${network.testAccuracy.toFixed(1)}%` : '0.0%';

    const w = this.canvas.width;
    const h = this.canvas.height;
    const res = this.gridResolution;
    const cellW = w / res;
    const cellH = h / res;

    // 1. Renderizar Heatmap de Fondo
    const imgData = this.ctx.createImageData(res, res);
    const data = imgData.data;

    const class0Color = { r: 16, g: 185, b: 129 }; // Esmeralda / Seguro
    const class1Color = { r: 244, g: 63, b: 94 };  // Rojo / Alerta

    // Ajustar colores según problema si procede
    if (problem.id === 'fraud') {
      class0Color.r = 6; class0Color.g = 182; class0Color.b = 212; // Cyan
      class1Color.r = 249; class1Color.g = 115; class1Color.b = 22; // Naranja
    } else if (problem.id === 'quality') {
      class0Color.r = 139; class0Color.g = 92; class0Color.b = 246; // Violeta
      class1Color.r = 234; class1Color.g = 179; class1Color.b = 8;  // Amarillo
    }

    for (let gy = 0; gy < res; gy++) {
      const x2 = -((gy / res) * 2 - 1); // Invertir eje Y para coordenadas estándar
      for (let gx = 0; gx < res; gx++) {
        const x1 = (gx / res) * 2 - 1;
        let pred = network.forward(network.extractFeatures({ x1, x2 }));

        if (this.discretize) {
          pred = pred >= 0.5 ? 1 : 0;
        }

        const pixelIdx = (gy * res + gx) * 4;
        // Interpolación de color
        const r = Math.round(class0Color.r * (1 - pred) + class1Color.r * pred);
        const g = Math.round(class0Color.g * (1 - pred) + class1Color.g * pred);
        const b = Math.round(class0Color.b * (1 - pred) + class1Color.b * pred);

        data[pixelIdx] = r;
        data[pixelIdx + 1] = g;
        data[pixelIdx + 2] = b;
        data[pixelIdx + 3] = 215; // Opacidad
      }
    }

    // Dibujar el heatmap escalado en el canvas
    // Usamos un offscreen canvas para escalado bilineal suave
    if (!this.offscreenCanvas) {
      this.offscreenCanvas = document.createElement('canvas');
      this.offscreenCanvas.width = res;
      this.offscreenCanvas.height = res;
    }
    const offCtx = this.offscreenCanvas.getContext('2d');
    offCtx.putImageData(imgData, 0, 0);

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.drawImage(this.offscreenCanvas, 0, 0, w, h);

    // 2. Líneas guía de ejes (origen 0,0)
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([4, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(w / 2, 0);
    this.ctx.lineTo(w / 2, h);
    this.ctx.moveTo(0, h / 2);
    this.ctx.lineTo(w, h / 2);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // 3. Dibujar Puntos de Datos de Entrenamiento (Train Data)
    if (trainData) {
      for (const pt of trainData) {
        const px = ((pt.x1 + 1) / 2) * w;
        const py = ((-pt.x2 + 1) / 2) * h;
        const isClass1 = pt.label === 1;
        const color = isClass1 
          ? `rgb(${class1Color.r}, ${class1Color.g}, ${class1Color.b})`
          : `rgb(${class0Color.r}, ${class0Color.g}, ${class0Color.b})`;

        this.ctx.beginPath();
        this.ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.stroke();
      }
    }

    // 4. Dibujar Puntos de Datos de Evaluación (Test Data)
    if (this.showTestData && testData) {
      for (const pt of testData) {
        const px = ((pt.x1 + 1) / 2) * w;
        const py = ((-pt.x2 + 1) / 2) * h;
        const isClass1 = pt.label === 1;
        const color = isClass1 
          ? `rgb(${class1Color.r}, ${class1Color.g}, ${class1Color.b})`
          : `rgb(${class0Color.r}, ${class0Color.g}, ${class0Color.b})`;

        // Puntos de test con anillo exterior punteado
        this.ctx.beginPath();
        this.ctx.arc(px, py, 5.5, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(px, py, 7.5, 0, Math.PI * 2);
        this.ctx.lineWidth = 1.2;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.stroke();
      }
    }

    // 5. Dibujar Custom Probe si existe
    if (this.customProbe) {
      const px = ((this.customProbe.x1 + 1) / 2) * w;
      const py = ((-this.customProbe.x2 + 1) / 2) * h;

      // Efecto diana / mirilla
      this.ctx.save();
      this.ctx.strokeStyle = '#f59e0b';
      this.ctx.lineWidth = 2.5;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 11, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.fillStyle = '#f59e0b';
      this.ctx.beginPath();
      this.ctx.arc(px, py, 4, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}
