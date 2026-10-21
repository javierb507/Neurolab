import { getLang, onLangChange, t } from '../i18n/index.js';

/**
 * Módulo Didáctico de Redes Recurrentes (RNN/LSTM) y Transformers con Soporte Bilingüe
 */

export class RNNVisualizer {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentStep = 0;
    this.isPlaying = false;
    this.playTimer = null;

    this.tokensData = {
      es: [
        { word: 'Paciente', val: 0.1, desc: 'Sujeto neutro inicial' },
        { word: 'presenta', val: 0.2, desc: 'Verbo de observación clínica' },
        { word: 'fiebre', val: 0.8, desc: 'Síntoma: Estado oculto sube a nivel de ALERTA' },
        { word: 'y dolor', val: 0.95, desc: 'Agravamiento: Memoria interna acumula alta preocupación' },
        { word: 'pero', val: 0.4, desc: 'Conjunción adversativa: Cambia el rumbo semántico' },
        { word: 'el análisis', val: 0.2, desc: 'Entrada de evidencia diagnóstica' },
        { word: 'descartó', val: -0.8, desc: 'Negación clave: Neutraliza los síntomas anteriores' },
        { word: 'infección.', val: -0.9, desc: 'Conclusión: La memoria clasifica como "Bajo Riesgo"' }
      ],
      en: [
        { word: 'Patient', val: 0.1, desc: 'Initial neutral subject' },
        { word: 'presents', val: 0.2, desc: 'Clinical observation verb' },
        { word: 'fever', val: 0.8, desc: 'Symptom: Hidden state jumps to ALERT level' },
        { word: 'and pain', val: 0.95, desc: 'Worsening: Memory accumulates high medical concern' },
        { word: 'but', val: 0.4, desc: 'Adversative conjunction: Shifts semantic trajectory' },
        { word: 'lab tests', val: 0.2, desc: 'Introduction of diagnostic evidence' },
        { word: 'ruled out', val: -0.8, desc: 'Key negation: Neutralizes previous alarm symptoms' },
        { word: 'infection.', val: -0.9, desc: 'Conclusion: Memory classifies as "Low Risk"' }
      ]
    };

    this.initDOM();
    this.render();

    onLangChange(() => {
      this.initDOM();
      this.render();
    });
  }

  get sentenceTokens() {
    return this.tokensData[getLang()] || this.tokensData.es;
  }

  initDOM() {
    const isEn = getLang() === 'en';
    const compCards = t('rnn.compCards') || [];

    this.container.innerHTML = `
      <div class="rnn-section">
        <div class="module-intro">
          <div class="intro-badge"><i class="fa-solid fa-clock-rotate-left"></i> ${t('rnn.badge')}</div>
          <h2>${t('rnn.title')}</h2>
          <p>${t('rnn.desc')}</p>
        </div>

        <div class="rnn-controls-bar">
          <div class="rnn-step-ctrls">
            <button class="btn-primary" id="btn-rnn-play">
              <i class="fa-solid fa-play"></i> <span id="btn-rnn-play-text">${t('rnn.playSeq')}</span>
            </button>
            <button class="btn-secondary" id="btn-rnn-prev">
              <i class="fa-solid fa-backward-step"></i> ${t('rnn.prevBtn')}
            </button>
            <button class="btn-secondary" id="btn-rnn-next">
              ${t('rnn.nextBtn')} <i class="fa-solid fa-forward-step"></i>
            </button>
            <button class="btn-secondary" id="btn-rnn-reset">
              <i class="fa-solid fa-rotate-left"></i> ${t('rnn.resetBtn')}
            </button>
          </div>
          <div class="rnn-step-counter">
            ${t('rnn.stepLabel')} <strong id="rnn-step-display">1 / 8</strong>
          </div>
        </div>

        <!-- Tira de Palabras / Tokens -->
        <div class="tokens-timeline" id="tokens-timeline"></div>

        <!-- Diagrama Unfolded de la RNN -->
        <div class="rnn-architecture-unfolded">
          <div class="rnn-card-stage">
            <div class="rnn-node-box input-box">
              <div class="box-tag">${t('rnn.tagInput')}</div>
              <div class="box-val" id="rnn-cur-word">...</div>
            </div>
            <i class="fa-solid fa-arrow-down rnn-flow-arrow"></i>
            <div class="rnn-node-box cell-box">
              <div class="box-tag">${t('rnn.tagCell')}</div>
              <div class="box-formula">h<sub>t</sub> = tanh(W<sub>hh</sub> · h<sub>t-1</sub> + W<sub>xh</sub> · x<sub>t</sub> + b)</div>
              <div class="memory-meter-container">
                <div class="memory-meter-label">
                  <span>${t('rnn.alarmLabel')}</span>
                  <span id="rnn-mem-val" class="mem-percent">0%</span>
                </div>
                <div class="memory-meter-bar">
                  <div class="memory-meter-fill" id="rnn-mem-fill"></div>
                </div>
              </div>
            </div>
            <i class="fa-solid fa-arrow-down rnn-flow-arrow"></i>
            <div class="rnn-node-box output-box">
              <div class="box-tag">${t('rnn.tagOutput')}</div>
              <div class="box-val" id="rnn-cur-pred">...</div>
            </div>
          </div>

          <!-- Cuadro explicativo didáctico -->
          <div class="rnn-insight-card">
            <div class="insight-header">
              <i class="fa-solid fa-brain"></i>
              <span>${t('rnn.insightTitle')}</span>
            </div>
            <div class="insight-body" id="rnn-step-insight">
              ...
            </div>
          </div>
        </div>

        <!-- Comparativa Didáctica: MLP vs RNN vs Transformer -->
        <div class="comparison-cards-grid">
          ${compCards.map((c, idx) => `
            <div class="comp-card ${idx === 1 ? 'featured' : ''}">
              <div class="comp-icon"><i class="fa-solid ${idx === 0 ? 'fa-network-wired' : (idx === 1 ? 'fa-repeat' : 'fa-bolt')}"></i></div>
              <h4>${c.title}</h4>
              <div class="comp-tag ${idx === 1 ? 'active' : (idx === 2 ? 'modern' : '')}">${c.tag}</div>
              <p>${c.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Bind controls
    this.container.querySelector('#btn-rnn-play').addEventListener('click', () => this.togglePlay());
    this.container.querySelector('#btn-rnn-next').addEventListener('click', () => this.nextStep());
    this.container.querySelector('#btn-rnn-prev').addEventListener('click', () => this.prevStep());
    this.container.querySelector('#btn-rnn-reset').addEventListener('click', () => {
      this.stopPlay();
      this.currentStep = 0;
      this.render();
    });
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const btnText = this.container.querySelector('#btn-rnn-play-text');
    const playBtn = this.container.querySelector('#btn-rnn-play');

    if (this.isPlaying) {
      if (btnText) btnText.textContent = t('rnn.pauseSeq');
      playBtn.classList.add('playing');
      this.playTimer = setInterval(() => {
        if (this.currentStep >= this.sentenceTokens.length - 1) {
          this.currentStep = 0;
        } else {
          this.currentStep++;
        }
        this.render();
      }, 1400);
    } else {
      this.stopPlay();
    }
  }

  stopPlay() {
    this.isPlaying = false;
    const btnText = this.container.querySelector('#btn-rnn-play-text');
    const playBtn = this.container.querySelector('#btn-rnn-play');
    if (btnText) btnText.textContent = t('rnn.playSeq');
    if (playBtn) playBtn.classList.remove('playing');
    if (this.playTimer) clearInterval(this.playTimer);
  }

  nextStep() {
    this.stopPlay();
    if (this.currentStep < this.sentenceTokens.length - 1) {
      this.currentStep++;
      this.render();
    }
  }

  prevStep() {
    this.stopPlay();
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  }

  render() {
    const tokens = this.sentenceTokens;
    if (this.currentStep >= tokens.length) this.currentStep = 0;
    const cur = tokens[this.currentStep];

    // 1. Contador
    const counterEl = this.container.querySelector('#rnn-step-display');
    if (counterEl) counterEl.textContent = `${this.currentStep + 1} / ${tokens.length}`;

    // 2. Timeline de Palabras
    const timeline = this.container.querySelector('#tokens-timeline');
    if (timeline) {
      timeline.innerHTML = tokens.map((tk, idx) => {
        let cls = 'token-pill';
        if (idx === this.currentStep) cls += ' active';
        else if (idx < this.currentStep) cls += ' passed';
        return `
          <div class="${cls}" data-idx="${idx}">
            <span class="tk-idx">t=${idx + 1}</span>
            <span class="tk-word">${tk.word}</span>
          </div>
        `;
      }).join('');

      timeline.querySelectorAll('.token-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          this.stopPlay();
          this.currentStep = parseInt(pill.getAttribute('data-idx'));
          this.render();
        });
      });
    }

    // 3. Nodos Unfolded
    const wordEl = this.container.querySelector('#rnn-cur-word');
    if (wordEl) wordEl.textContent = `"${cur.word}"`;

    const memValEl = this.container.querySelector('#rnn-mem-val');
    const memFillEl = this.container.querySelector('#rnn-mem-fill');
    
    // Normalizar val [-1, 1] a [0, 100%]
    const percent = Math.round(((cur.val + 1) / 2) * 100);
    if (memValEl) memValEl.textContent = `${percent}%`;
    if (memFillEl) {
      memFillEl.style.width = `${percent}%`;
      if (cur.val > 0.6) {
        memFillEl.style.background = '#ef4444'; // Rojo alarma
      } else if (cur.val < 0) {
        memFillEl.style.background = '#10b981'; // Verde seguro
      } else {
        memFillEl.style.background = '#00f2fe'; // Cian
      }
    }

    const predEl = this.container.querySelector('#rnn-cur-pred');
    if (predEl) {
      if (cur.val > 0.6) {
        predEl.innerHTML = `<span style="color: #ef4444; font-weight: 800;">${t('rnn.alertEval')}</span>`;
      } else if (cur.val < -0.3) {
        predEl.innerHTML = `<span style="color: #10b981; font-weight: 800;">${t('rnn.lowRiskEval')}</span>`;
      } else {
        predEl.innerHTML = `<span style="color: #38bdf8;">${t('rnn.stableEval')}</span>`;
      }
    }

    // 4. Insight box
    const insightEl = this.container.querySelector('#rnn-step-insight');
    if (insightEl) {
      insightEl.innerHTML = `
        <p><strong>Token recibido:</strong> <code>"${cur.word}"</code></p>
        <p class="insight-p">${cur.desc}</p>
        <div class="math-subnote">
          Estado oculto previo (h<sub>t-1</sub>) combinado con la nueva palabra produce un nuevo estado h<sub>t</sub> = <strong>${cur.val.toFixed(2)}</strong>.
        </div>
      `;
    }
  }
}
