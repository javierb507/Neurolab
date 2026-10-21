import { t, onLangChange } from '../i18n/index.js';

export class LossChart {
  constructor(containerEl) {
    this.container = containerEl;
    this.lastLossHistory = null;
    this.initDOM();

    onLangChange(() => {
      this.initDOM();
      if (this.lastLossHistory) this.render(this.lastLossHistory);
    });
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="loss-chart-wrapper">
        <div class="chart-header">
          <div class="chart-title">
            <i class="fa-solid fa-chart-line"></i>
            <span>${t('lossChart.title')}</span>
          </div>
          <div class="chart-legend">
            <span class="legend-chip train"><span class="chip-color"></span> ${t('lossChart.trainLoss')}</span>
            <span class="legend-chip test"><span class="chip-color"></span> ${t('lossChart.testLoss')}</span>
          </div>
        </div>
        <canvas id="loss-canvas" width="380" height="130"></canvas>
      </div>
    `;

    this.canvas = this.container.querySelector('#loss-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  render(lossHistory) {
    this.lastLossHistory = lossHistory;
    if (!this.canvas || !lossHistory || lossHistory.length < 2) {
      this.clear();
      return;
    }

    const w = this.canvas.width;
    const h = this.canvas.height;
    const padding = { top: 15, right: 15, bottom: 25, left: 35 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    this.ctx.clearRect(0, 0, w, h);

    // Encontrar máximo de pérdida para escalar
    let maxLoss = 0.1;
    for (const item of lossHistory) {
      if (item.trainLoss > maxLoss) maxLoss = item.trainLoss;
      if (item.testLoss > maxLoss) maxLoss = item.testLoss;
    }
    maxLoss = Math.min(2.5, maxLoss * 1.15); // margen superior

    // Dibujar rejilla de fondo
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let i = 0; i <= 3; i++) {
      const y = padding.top + (plotH / 3) * i;
      this.ctx.moveTo(padding.left, y);
      this.ctx.lineTo(w - padding.right, y);
      
      const val = (maxLoss * (1 - i / 3)).toFixed(2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.font = '9px monospace';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(val, padding.left - 5, y + 3);
    }
    this.ctx.stroke();

    // Dibujar curvas
    const n = lossHistory.length;

    // 1. Train Loss Curve
    this.ctx.strokeStyle = '#00f2fe';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const item = lossHistory[i];
      const x = padding.left + (i / (n - 1)) * plotW;
      const y = padding.top + plotH - (Math.min(maxLoss, item.trainLoss) / maxLoss) * plotH;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();

    // 2. Test Loss Curve
    this.ctx.strokeStyle = '#f59e0b';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const item = lossHistory[i];
      const x = padding.left + (i / (n - 1)) * plotW;
      const y = padding.top + plotH - (Math.min(maxLoss, item.testLoss) / maxLoss) * plotH;
      if (i === 0) this.ctx.moveTo(x, y);
      else this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();

    // Eje X: épocas
    const lastEpoch = lossHistory[n - 1].epoch;
    const firstEpoch = lossHistory[0].epoch;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.font = '9px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Época ${firstEpoch}`, padding.left, h - 8);
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Época ${lastEpoch}`, w - padding.right, h - 8);
  }

  clear() {
    if (!this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.font = '11px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Inicia el entrenamiento para ver la curva de Loss', this.canvas.width / 2, this.canvas.height / 2);
  }
}
