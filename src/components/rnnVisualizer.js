/**
 * Módulo Didáctico de Redes Recurrentes (RNN/LSTM) y Transformers
 * Explica cómo las redes con memoria procesan texto, lenguaje y series temporales paso a paso.
 */

export class RNNVisualizer {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentStep = 0;
    this.isPlaying = false;

    // Escenario de procesamiento de lenguaje clínico / sentimiento
    this.sentenceTokens = [
      { word: 'Paciente', val: 0.1, desc: 'Sujeto neutro inicial' },
      { word: 'presenta', val: 0.2, desc: 'Verbo de observación clínica' },
      { word: 'fiebre', val: 0.8, desc: 'Síntoma: Estado oculto sube a nivel de ALERTA' },
      { word: 'y dolor', val: 0.95, desc: 'Agravamiento: Memoria interna acumula alta preocupación' },
      { word: 'pero', val: 0.4, desc: 'Conjunción adversativa: Cambia el rumbo semántico' },
      { word: 'el análisis', val: 0.2, desc: 'Entrada de evidencia diagnóstica' },
      { word: 'descartó', val: -0.8, desc: 'Negación clave: Neutraliza los síntomas anteriores' },
      { word: 'infección.', val: -0.9, desc: 'Conclusión: La memoria clasifica como "Bajo Riesgo"' }
    ];

    this.initDOM();
    this.render();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="rnn-section">
        <div class="module-intro">
          <div class="intro-badge"><i class="fa-solid fa-clock-rotate-left"></i> Memoria y Secuencias Temporales</div>
          <h2>Redes Recurrentes (RNN) vs. Transformers</h2>
          <p>
            Una red densa (MLP) no tiene noción del orden ni del tiempo: procesa cada dato como un evento aislado.
            Las <strong>Redes Recurrentes (RNN)</strong> tienen un bucle de retroalimentación interna llamado 
            <strong>Estado Oculto (Hidden State h<sub>t</sub>)</strong> que transporta la memoria del pasado hacia el futuro.
          </p>
        </div>

        <div class="rnn-controls-bar">
          <div class="rnn-step-ctrls">
            <button class="btn-primary" id="btn-rnn-play">
              <i class="fa-solid fa-play"></i> Reproducir Secuencia
            </button>
            <button class="btn-secondary" id="btn-rnn-prev">
              <i class="fa-solid fa-backward-step"></i> Anterior
            </button>
            <button class="btn-secondary" id="btn-rnn-next">
              Siguiente <i class="fa-solid fa-forward-step"></i>
            </button>
            <button class="btn-secondary" id="btn-rnn-reset">
              <i class="fa-solid fa-rotate-left"></i> Reiniciar
            </button>
          </div>
          <div class="rnn-step-counter">
            Paso: <strong id="rnn-step-display">1 / 8</strong>
          </div>
        </div>

        <!-- Tira de Palabras / Tokens -->
        <div class="tokens-timeline" id="tokens-timeline"></div>

        <!-- Diagrama Unfolded de la RNN -->
        <div class="rnn-architecture-unfolded">
          <div class="rnn-card-stage">
            <div class="rnn-node-box input-box">
              <div class="box-tag">Palabra Entrada (x<sub>t</sub>)</div>
              <div class="box-val" id="rnn-cur-word">Paciente</div>
            </div>
            <i class="fa-solid fa-arrow-down rnn-flow-arrow"></i>
            <div class="rnn-node-box cell-box">
              <div class="box-tag">Célula Recurrente (RNN Cell)</div>
              <div class="box-formula">h<sub>t</sub> = tanh(W<sub>hh</sub> · h<sub>t-1</sub> + W<sub>xh</sub> · x<sub>t</sub> + b)</div>
              <div class="memory-meter-container">
                <div class="memory-meter-label">
                  <span>Nivel de Alarma en Memoria (h<sub>t</sub>):</span>
                  <span id="rnn-mem-val" class="mem-percent">0%</span>
                </div>
                <div class="memory-meter-bar">
                  <div class="memory-meter-fill" id="rnn-mem-fill"></div>
                </div>
              </div>
            </div>
            <i class="fa-solid fa-arrow-down rnn-flow-arrow"></i>
            <div class="rnn-node-box output-box">
              <div class="box-tag">Predicción en tiempo t (ŷ<sub>t</sub>)</div>
              <div class="box-val" id="rnn-cur-pred">Evaluación Estable</div>
            </div>
          </div>

          <!-- Cuadro explicativo didáctico -->
          <div class="rnn-insight-card">
            <div class="insight-header">
              <i class="fa-solid fa-brain"></i>
              <span>¿Qué ocurre en este instante?</span>
            </div>
            <div class="insight-body" id="rnn-step-insight">
              Cargando paso...
            </div>
          </div>
        </div>

        <!-- Comparativa Didáctica: MLP vs RNN vs Transformer -->
        <div class="comparison-cards-grid">
          <div class="comp-card">
            <div class="comp-icon"><i class="fa-solid fa-network-wired"></i></div>
            <h4>Perceptrón Multicapa (MLP)</h4>
            <div class="comp-tag">Sin Memoria</div>
            <p>Lee todas las palabras a la vez o de forma aislada. No sabe si "descartó" vino antes o después de "infección".</p>
          </div>
          <div class="comp-card featured">
            <div class="comp-icon"><i class="fa-solid fa-repeat"></i></div>
            <h4>Red Recurrente (RNN / LSTM)</h4>
            <div class="comp-tag active">Memoria Secuencial</div>
            <p>Lee palabra por palabra paso a paso. Problema: En frases muy largas, los primeros recuerdos tienden a olvidarse (Vanishing Gradient).</p>
          </div>
          <div class="comp-card">
            <div class="comp-icon"><i class="fa-solid fa-bolt"></i></div>
            <h4>Transformer (Atención)</h4>
            <div class="comp-tag modern">Auto-Atención Directa</div>
            <p>La arquitectura de ChatGPT: conecta todas las palabras entre sí simultáneamente sin necesidad de procesar una por una, permitiendo comprender contextos gigantescos.</p>
          </div>
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
    if (this.isPlaying) {
      this.stopPlay();
    } else {
      this.isPlaying = true;
      const btn = this.container.querySelector('#btn-rnn-play');
      btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pausar`;
      btn.classList.add('btn-warning');

      this.timer = setInterval(() => {
        if (this.currentStep < this.sentenceTokens.length - 1) {
          this.currentStep++;
          this.render();
        } else {
          this.stopPlay();
        }
      }, 1000);
    }
  }

  stopPlay() {
    this.isPlaying = false;
    clearInterval(this.timer);
    const btn = this.container.querySelector('#btn-rnn-play');
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-play"></i> Reproducir Secuencia`;
      btn.classList.remove('btn-warning');
    }
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
    const curToken = this.sentenceTokens[this.currentStep];
    const total = this.sentenceTokens.length;

    // Actualizar contador
    this.container.querySelector('#rnn-step-display').textContent = `${this.currentStep + 1} / ${total}`;

    // Renderizar timeline de tokens
    const timeline = this.container.querySelector('#tokens-timeline');
    timeline.innerHTML = '';
    this.sentenceTokens.forEach((tok, idx) => {
      const chip = document.createElement('div');
      chip.className = `token-chip ${idx === this.currentStep ? 'current' : (idx < this.currentStep ? 'passed' : '')}`;
      chip.innerHTML = `
        <span class="tok-idx">t=${idx + 1}</span>
        <span class="tok-word">${tok.word}</span>
      `;
      chip.addEventListener('click', () => {
        this.stopPlay();
        this.currentStep = idx;
        this.render();
      });
      timeline.appendChild(chip);
    });

    // Calcular estado de memoria acumulada hasta este paso
    let memScore = 0;
    for (let i = 0; i <= this.currentStep; i++) {
      // Decaimiento del pasado (0.8) + nueva palabra
      memScore = memScore * 0.75 + this.sentenceTokens[i].val * 0.45;
    }
    memScore = Math.max(-1, Math.min(1, memScore));

    // Nivel de alarma en porcentaje (0 a 100%)
    const alarmPct = Math.round(((memScore + 1) / 2) * 100);

    this.container.querySelector('#rnn-cur-word').textContent = `"${curToken.word}"`;
    this.container.querySelector('#rnn-mem-val').textContent = `${alarmPct}%`;
    
    const fillEl = this.container.querySelector('#rnn-mem-fill');
    fillEl.style.width = `${alarmPct}%`;
    if (alarmPct > 65) {
      fillEl.style.backgroundColor = '#ef4444'; // Rojo alarma
    } else if (alarmPct > 40) {
      fillEl.style.backgroundColor = '#f59e0b'; // Amarillo alerta
    } else {
      fillEl.style.backgroundColor = '#10b981'; // Verde tranquilidad
    }

    // Predicción textual en tiempo t
    let predText = 'Estado Estable / Sin anomalía';
    if (alarmPct > 70) predText = '⚠️ ALERTA MÉDICA: Riesgo de Urgencia';
    else if (alarmPct > 45) predText = '🔍 Observación: Síntomas moderados';
    else predText = '✅ Pronóstico Favorable: Sin signos de alarma';

    this.container.querySelector('#rnn-cur-pred').textContent = predText;

    // Texto descriptivo del paso
    const insightEl = this.container.querySelector('#rnn-step-insight');
    insightEl.innerHTML = `
      <div class="insight-token-title">Palabra procesada: <strong>"${curToken.word}"</strong></div>
      <p>${curToken.desc}</p>
      <div class="insight-math-note">
        <strong>Efecto del Estado Oculto (h<sub>t</sub>):</strong> 
        La célula combina la memoria previa acumulada con la nueva palabra "${curToken.word}". 
        ${this.currentStep >= 6 
          ? 'Nota cómo la palabra "descartó" disminuye drásticamente el nivel de alarma, anulando la preocupación de "fiebre" y "dolor". Esto demuestra por qué el orden secuencial es vital.' 
          : 'Avanza hacia las siguientes palabras para ver cómo se transforma la memoria.'}
      </div>
    `;
  }
}
