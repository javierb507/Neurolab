import { sounds } from './soundEffects.js';

/**
 * Laboratorio Interactivo de Tokenización y LLM (Transformers)
 * Anima paso a paso:
 * 1. Tokenización y asignación de Token IDs (BPE)
 * 2. Matriz y arcos de Atención (Self-Attention) interactivos
 * 3. Ruleta de probabilidades de la siguiente palabra (Softmax)
 * 4. Bucle generativo autorregresivo animado
 */

export class LLMVisualizer {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentPresetKey = 'gato';
    this.isAutoplaying = false;
    this.autoPlayTimer = null;
    this.hoveredTokenIndex = null;

    // Presets educativos interactivos
    this.presets = {
      gato: {
        title: 'El gato curioso',
        initialText: 'El gato bebió',
        steps: [
          {
            nextCandidates: [
              { token: ' leche', prob: 64, id: 1420 },
              { token: ' agua', prob: 24, id: 2841 },
              { token: ' despacio', prob: 8, id: 9152 },
              { token: ' gasolina', prob: 0.1, id: 48902 }
            ],
            chosen: ' leche'
          },
          {
            nextCandidates: [
              { token: ' tibia', prob: 52, id: 18991 },
              { token: ' y', prob: 36, id: 284 },
              { token: ' fresca', prob: 9, id: 14231 },
              { token: ' con', prob: 3, id: 412 }
            ],
            chosen: ' y'
          },
          {
            nextCandidates: [
              { token: ' se', prob: 78, id: 312 },
              { token: ' luego', prob: 14, id: 5120 },
              { token: ' maulló', prob: 6, id: 22104 },
              { token: ' corrió', prob: 2, id: 18320 }
            ],
            chosen: ' se'
          },
          {
            nextCandidates: [
              { token: ' durmió', prob: 82, id: 16420 },
              { token: ' fue', prob: 12, id: 4180 },
              { token: ' marchó', prob: 4, id: 11029 },
              { token: ' quedó', prob: 2, id: 8401 }
            ],
            chosen: ' durmió'
          },
          {
            nextCandidates: [
              { token: '.', prob: 88, id: 13 },
              { token: ' plácidamente', prob: 9, id: 24102 },
              { token: ' en', prob: 3, id: 265 }
            ],
            chosen: '.'
          }
        ]
      },

      bancoParque: {
        title: 'El significado de "Banco" (Contexto Parque)',
        initialText: 'El banco del parque estaba',
        steps: [
          {
            nextCandidates: [
              { token: ' roto', prob: 56, id: 8240 },
              { token: ' mojado', prob: 28, id: 12901 },
              { token: ' ocupado', prob: 11, id: 17290 },
              { token: ' quebrado', prob: 0.2, id: 29014 } // quebrado bancario no aplica a parque
            ],
            chosen: ' roto'
          },
          {
            nextCandidates: [
              { token: ' por', prob: 48, id: 450 },
              { token: ' y', prob: 34, id: 284 },
              { token: '.', prob: 18, id: 13 }
            ],
            chosen: '.'
          }
        ]
      },

      bancoDinero: {
        title: 'El significado de "Banco" (Contexto Financiero)',
        initialText: 'Fui al banco a pedir un',
        steps: [
          {
            nextCandidates: [
              { token: ' préstamo', prob: 72, id: 9402 },
              { token: ' crédito', prob: 21, id: 6204 },
              { token: ' extracto', prob: 5, id: 18204 },
              { token: ' asiento', prob: 0.1, id: 11402 } // asiento no aplica a entidad financiera
            ],
            chosen: ' préstamo'
          },
          {
            nextCandidates: [
              { token: ' hipotecario', prob: 61, id: 22104 },
              { token: ' personal', prob: 31, id: 5801 },
              { token: '.', prob: 8, id: 13 }
            ],
            chosen: ' hipotecario'
          },
          {
            nextCandidates: [
              { token: '.', prob: 92, id: 13 }
            ],
            chosen: '.'
          }
        ]
      }
    };

    this.currentText = this.presets[this.currentPresetKey].initialText;
    this.generationStepIndex = 0;

    this.initDOM();
    this.update();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="llm-section">
        <div class="module-intro">
          <div class="intro-badge"><i class="fa-solid fa-comments"></i> Procesamiento del Lenguaje Natural (NLP)</div>
          <h2>¿Cómo Funciona un LLM por Dentro? De Texto a Probabilidades</h2>
          <p>
            Los modelos como ChatGPT o Gemini no leen palabras como los humanos ni buscan respuestas pregrabadas.
            A continuación puedes ver la animación en vivo de los <strong>3 pasos fundamentales</strong>:
            <strong>Tokenización</strong> (troceado numérico), <strong>Auto-Atención</strong> (comprensión contextual)
            y <strong>Predicción Autorregresiva</strong> (adivinar la siguiente pieza).
          </p>
        </div>

        <!-- Barra de Presets y Control -->
        <div class="llm-toolbar">
          <div class="preset-selector-group">
            <label><i class="fa-solid fa-bookmark"></i> Ejemplos Guiados:</label>
            <div class="llm-preset-chips" id="llm-preset-chips"></div>
          </div>
          <div class="llm-input-row">
            <input type="text" id="llm-custom-input" class="llm-input-box" placeholder="Escribe cualquier frase aquí para ver cómo se tokeniza...">
            <button class="btn-secondary" id="btn-llm-reset">
              <i class="fa-solid fa-rotate-left"></i> Reiniciar Frase
            </button>
          </div>
        </div>

        <!-- FASE 1: Tokenizador en Vivo -->
        <div class="llm-stage-card">
          <div class="stage-card-header">
            <div class="stage-title">
              <span class="stage-num-badge">Paso 1</span>
              <div>
                <h3>Tokenización y Asignación de IDs (BPE)</h3>
                <span class="stage-subtitle">La frase se divide en subpalabras y cada una recibe un código numérico del diccionario (Vocabulario).</span>
              </div>
            </div>
            <div class="token-count-indicator">Total: <strong id="token-total-count">0</strong> tokens</div>
          </div>

          <div class="tokenized-ribbon" id="tokenized-ribbon">
            <!-- Tokens animados generados dinámicamente -->
          </div>

          <div class="token-didactic-note">
            <i class="fa-solid fa-circle-info"></i>
            <span>Nota los colores y el símbolo <code>_</code>: los espacios iniciales también son parte del token. Las palabras compuestas o conjugadas se dividen en prefijos y sufijos para ahorrar memoria.</span>
          </div>
        </div>

        <!-- FASE 2: Mecanismo de Auto-Atención (Self-Attention) -->
        <div class="llm-stage-card">
          <div class="stage-card-header">
            <div class="stage-title">
              <span class="stage-num-badge">Paso 2</span>
              <div>
                <h3>Mecanismo de Auto-Atención (Self-Attention)</h3>
                <span class="stage-subtitle">
                  Pasa el cursor sobre cualquier palabra para ver cómo el Transformer conecta unas palabras con otras para deducir el contexto exacto.
                </span>
              </div>
            </div>
            <div class="attention-hint"><i class="fa-regular fa-hand-pointer"></i> Haz hover en un token</div>
          </div>

          <div class="attention-canvas-wrapper">
            <svg id="attention-svg" class="attention-svg"></svg>
            <div id="attention-tokens-bar" class="attention-tokens-bar"></div>
          </div>

          <div class="attention-expl-box" id="attention-expl-box">
            Pasa el ratón sobre un token para ver qué palabras le dan su significado contextual.
          </div>
        </div>

        <!-- FASE 3: Ruleta de Probabilidades y Generación Autorregresiva -->
        <div class="llm-stage-card">
          <div class="stage-card-header">
            <div class="stage-title">
              <span class="stage-num-badge">Paso 3</span>
              <div>
                <h3>Predicción de la Siguiente Palabra (Softmax)</h3>
                <span class="stage-subtitle">
                  El LLM calcula qué token tiene mayor probabilidad matemática de continuar la historia.
                </span>
              </div>
            </div>
            <div class="generation-controls">
              <button class="btn-primary" id="btn-next-token">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Predecir Siguiente Token
              </button>
              <button class="btn-secondary" id="btn-auto-generate">
                <i class="fa-solid fa-play"></i> Auto-Generar
              </button>
            </div>
          </div>

          <div class="probabilities-grid">
            <div class="candidates-col">
              <div class="col-title">Distribución de Probabilidades para el Próximo Token:</div>
              <div class="candidates-list" id="candidates-list">
                <!-- Barras de probabilidad animadas -->
              </div>
            </div>

            <div class="autoregressive-col">
              <div class="col-title">El Bucle Autorregresivo:</div>
              <div class="loop-diagram">
                <div class="loop-step">
                  <span class="step-circle">1</span>
                  <span>Elige el token más probable (o por muestreo)</span>
                </div>
                <div class="loop-arrow"><i class="fa-solid fa-arrow-down"></i></div>
                <div class="loop-step highlight">
                  <span class="step-circle">2</span>
                  <span>Lo añade al final del texto</span>
                </div>
                <div class="loop-arrow"><i class="fa-solid fa-arrow-down"></i></div>
                <div class="loop-step">
                  <span class="step-circle">3</span>
                  <span>Vuelve al Paso 1 con la nueva frase ampliada</span>
                </div>
              </div>
              <div class="generated-preview" id="generated-preview">
                Frase completa en construcción...
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Presets chips
    const chipsContainer = this.container.querySelector('#llm-preset-chips');
    for (const [key, p] of Object.entries(this.presets)) {
      const chip = document.createElement('button');
      chip.className = `llm-preset-chip ${key === this.currentPresetKey ? 'active' : ''}`;
      chip.innerHTML = `<i class="fa-solid fa-lightbulb"></i> <span>${p.title}</span>`;
      chip.addEventListener('click', () => {
        sounds.playClick();
        this.selectPreset(key);
      });
      chipsContainer.appendChild(chip);
    }

    // Input personalizado
    const customInput = this.container.querySelector('#llm-custom-input');
    customInput.value = this.currentText;
    customInput.addEventListener('input', (e) => {
      this.stopAutoplay();
      this.currentText = e.target.value;
      this.generationStepIndex = 0;
      this.update();
    });

    // Botones
    this.container.querySelector('#btn-llm-reset').addEventListener('click', () => {
      sounds.playClick();
      this.stopAutoplay();
      this.selectPreset(this.currentPresetKey);
    });

    this.container.querySelector('#btn-next-token').addEventListener('click', () => {
      sounds.playStep();
      this.stepNextToken();
    });

    this.container.querySelector('#btn-auto-generate').addEventListener('click', () => {
      this.toggleAutoplay();
    });

    window.addEventListener('resize', () => this.renderAttention());
  }

  selectPreset(key) {
    this.currentPresetKey = key;
    this.generationStepIndex = 0;
    this.currentText = this.presets[key].initialText;

    // Actualizar input text
    const customInput = this.container.querySelector('#llm-custom-input');
    if (customInput) customInput.value = this.currentText;

    // Actualizar chips
    const chips = this.container.querySelectorAll('.llm-preset-chip');
    chips.forEach((c, idx) => {
      const pKeys = Object.keys(this.presets);
      c.classList.toggle('active', pKeys[idx] === key);
    });

    this.update();
  }

  /**
   * Tokenizador simulado BPE realista para español
   * Divide en prefijos, raíces, sufijos y signos de puntuación
   */
  tokenize(text) {
    if (!text || text.trim() === '') return [];

    const rawWords = text.match(/[\wáéíóúÁÉÍÓÚñÑ]+|[.,!?;:]|\s+/g) || [];
    const tokens = [];

    // Colores rotativos bonitos
    const palette = [
      { bg: 'rgba(0, 242, 254, 0.15)', border: '#00f2fe', text: '#00f2fe' },
      { bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', text: '#c084fc' },
      { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#34d399' },
      { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#fbbf24' },
      { bg: 'rgba(236, 72, 153, 0.15)', border: '#ec4899', text: '#f472b6' }
    ];

    let hasSpaceBefore = false;

    rawWords.forEach((item) => {
      if (/^\s+$/.test(item)) {
        hasSpaceBefore = true;
        return;
      }

      // Si es signo de puntuación
      if (/^[.,!?;:]$/.test(item)) {
        tokens.push({
          raw: item,
          display: item,
          id: this.hashString(item) % 800 + 10,
          color: palette[tokens.length % palette.length]
        });
        hasSpaceBefore = false;
        return;
      }

      // Descomposición subword pedagógica
      const prefix = hasSpaceBefore ? ' ' : '';
      hasSpaceBefore = false;

      // Palabras que se dividen en sufijos comunes
      if (item.endsWith('mente') && item.length > 5) {
        tokens.push({
          raw: prefix + item.slice(0, -5),
          display: (prefix ? '·' : '') + item.slice(0, -5),
          id: this.hashString(item.slice(0, -5)) % 40000 + 2000,
          color: palette[tokens.length % palette.length]
        });
        tokens.push({
          raw: 'mente',
          display: 'mente',
          id: 412,
          color: palette[tokens.length % palette.length]
        });
      } else if (item.endsWith('ando') && item.length > 5) {
        tokens.push({
          raw: prefix + item.slice(0, -4),
          display: (prefix ? '·' : '') + item.slice(0, -4),
          id: this.hashString(item.slice(0, -4)) % 40000 + 2000,
          color: palette[tokens.length % palette.length]
        });
        tokens.push({
          raw: 'ando',
          display: 'ando',
          id: 704,
          color: palette[tokens.length % palette.length]
        });
      } else {
        tokens.push({
          raw: prefix + item,
          display: (prefix ? '·' : '') + item,
          id: this.hashString(prefix + item) % 45000 + 1000,
          color: palette[tokens.length % palette.length]
        });
      }
    });

    return tokens;
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  stepNextToken() {
    const preset = this.presets[this.currentPresetKey];
    let nextChoice = '...';

    if (preset && preset.steps && this.generationStepIndex < preset.steps.length) {
      const step = preset.steps[this.generationStepIndex];
      nextChoice = step.chosen;
      this.generationStepIndex++;
    } else {
      // Si el usuario escribe una frase libre o terminó el preset
      const fallbackOptions = [' y', ' con', ' para', ' siempre', ' luego', '.'];
      nextChoice = fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
    }

    this.currentText += nextChoice;

    const customInput = this.container.querySelector('#llm-custom-input');
    if (customInput) customInput.value = this.currentText;

    this.update();

    if (preset && this.generationStepIndex >= preset.steps.length) {
      this.stopAutoplay();
      sounds.playSuccess();
    }
  }

  toggleAutoplay() {
    if (this.isAutoplaying) {
      this.stopAutoplay();
    } else {
      this.isAutoplaying = true;
      const btn = this.container.querySelector('#btn-auto-generate');
      btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pausar Generación`;
      btn.classList.add('btn-warning');

      this.autoPlayTimer = setInterval(() => {
        const preset = this.presets[this.currentPresetKey];
        if (preset && this.generationStepIndex >= preset.steps.length) {
          this.stopAutoplay();
          return;
        }
        this.stepNextToken();
      }, 1200);
    }
  }

  stopAutoplay() {
    this.isAutoplaying = false;
    clearInterval(this.autoPlayTimer);
    const btn = this.container.querySelector('#btn-auto-generate');
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-play"></i> Auto-Generar`;
      btn.classList.remove('btn-warning');
    }
  }

  update() {
    this.tokens = this.tokenize(this.currentText);
    this.renderTokenRibbon();
    this.renderAttention();
    this.renderPredictions();
  }

  /**
   * Renderiza la cinta animada de tokens
   */
  renderTokenRibbon() {
    const ribbon = this.container.querySelector('#tokenized-ribbon');
    const countEl = this.container.querySelector('#token-total-count');
    countEl.textContent = this.tokens.length;

    ribbon.innerHTML = '';
    this.tokens.forEach((tok, idx) => {
      const card = document.createElement('div');
      card.className = 'token-chip-visual';
      card.style.background = tok.color.bg;
      card.style.borderColor = tok.color.border;
      card.innerHTML = `
        <span class="tok-piece" style="color: ${tok.color.text}">${tok.display}</span>
        <span class="tok-id-badge">ID: ${tok.id}</span>
        <span class="tok-num-order">#${idx + 1}</span>
      `;
      ribbon.appendChild(card);
    });

    const previewEl = this.container.querySelector('#generated-preview');
    previewEl.innerHTML = `<strong>Frase actual acumulada:</strong> "${this.currentText}"`;
  }

  /**
   * Renderiza el diagrama de arcos de Self-Attention
   */
  renderAttention() {
    const svg = this.container.querySelector('#attention-svg');
    const bar = this.container.querySelector('#attention-tokens-bar');
    if (!svg || !bar || !this.tokens || this.tokens.length === 0) return;

    const w = bar.clientWidth || 700;
    const h = 180;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', `${w}`);
    svg.setAttribute('height', `${h}`);

    // Renderizar botones de tokens en la barra horizontal
    bar.innerHTML = '';
    const tokenPositions = [];
    const n = this.tokens.length;
    const colSpacing = w / Math.max(1, n);

    this.tokens.forEach((tok, idx) => {
      const cx = colSpacing * idx + colSpacing / 2;
      tokenPositions.push(cx);

      const span = document.createElement('div');
      span.className = `att-token-item ${this.hoveredTokenIndex === idx ? 'active' : ''}`;
      span.textContent = tok.display;
      span.style.color = tok.color.text;
      span.addEventListener('mouseenter', () => {
        this.hoveredTokenIndex = idx;
        sounds.playClick();
        this.renderAttention();
      });
      span.addEventListener('mouseleave', () => {
        this.hoveredTokenIndex = null;
        this.renderAttention();
      });
      bar.appendChild(span);
    });

    // Calcular matriz de pesos de atención didáctica
    // Si no hay hover, conectamos por defecto el último token hacia todos los anteriores
    const activeIdx = this.hoveredTokenIndex !== null ? this.hoveredTokenIndex : (n - 1);
    const activeToken = this.tokens[activeIdx];

    let svgContent = '';
    const baseY = h - 20;

    for (let i = 0; i < n; i++) {
      if (i === activeIdx) continue;

      // Calcular peso de atención didáctico
      let weight = 0.15; // base
      const t1 = this.tokens[i].raw.toLowerCase().trim();
      const t2 = activeToken.raw.toLowerCase().trim();

      // Reglas contextuales didácticas
      if ((t1.includes('banco') && t2.includes('parque')) || (t1.includes('parque') && t2.includes('banco'))) {
        weight = 0.95; // máxima atención semántica
      } else if ((t1.includes('banco') && t2.includes('préstamo')) || (t1.includes('préstamo') && t2.includes('banco'))) {
        weight = 0.96;
      } else if ((t1.includes('gato') && t2.includes('bebió')) || (t1.includes('bebió') && t2.includes('leche'))) {
        weight = 0.85;
      } else if (Math.abs(i - activeIdx) === 1) {
        weight = 0.45; // adyacencia
      }

      const x1 = tokenPositions[activeIdx];
      const x2 = tokenPositions[i];
      const distance = Math.abs(x1 - x2);
      const arcHeight = Math.min(130, 30 + distance * 0.35);
      const midX = (x1 + x2) / 2;
      const controlY = baseY - arcHeight;

      const path = `M ${x1} ${baseY} Q ${midX} ${controlY} ${x2} ${baseY}`;
      const strokeColor = weight > 0.6 ? '#00f2fe' : (weight > 0.3 ? '#a855f7' : 'rgba(255, 255, 255, 0.12)');
      const strokeW = Math.max(1, weight * 5);
      const opacity = Math.min(0.95, Math.max(0.2, weight));

      svgContent += `
        <path d="${path}" 
              stroke="${strokeColor}" 
              stroke-width="${strokeW}" 
              stroke-opacity="${opacity}" 
              fill="none" 
              class="attention-arc ${weight > 0.6 ? 'glow-arc' : ''}" />
      `;
    }

    // Dibujar punto origen sobre el token activo
    if (activeIdx < tokenPositions.length) {
      svgContent += `
        <circle cx="${tokenPositions[activeIdx]}" cy="${baseY}" r="6" fill="#00f2fe" class="source-dot" />
      `;
    }

    svg.innerHTML = svgContent;

    // Actualizar texto explicativo de la atención
    const explBox = this.container.querySelector('#attention-expl-box');
    if (activeToken) {
      explBox.innerHTML = `
        <strong>Token enfocado:</strong> <span class="badge-token-focus">${activeToken.display}</span> 
        ➜ El mecanismo de auto-atención escanea todos los demás tokens de la frase a la vez. 
        Las líneas más gruesas y brillantes indican las palabras que <strong>mayor peso de atención</strong> reciben para fijar su significado.
      `;
    }
  }

  /**
   * Renderiza el gráfico de barras de probabilidades (Softmax)
   */
  renderPredictions() {
    const list = this.container.querySelector('#candidates-list');
    list.innerHTML = '';

    const preset = this.presets[this.currentPresetKey];
    let candidates = [];

    if (preset && preset.steps && this.generationStepIndex < preset.steps.length) {
      candidates = preset.steps[this.generationStepIndex].nextCandidates;
    } else {
      // Fallback didáctico
      candidates = [
        { token: ' y', prob: 45, id: 284 },
        { token: ' que', prob: 28, id: 350 },
        { token: '.', prob: 18, id: 13 },
        { token: ' cuando', prob: 9, id: 1402 }
      ];
    }

    candidates.forEach((cand, idx) => {
      const row = document.createElement('div');
      row.className = `candidate-row ${idx === 0 ? 'top-candidate' : ''}`;
      row.innerHTML = `
        <div class="cand-label">
          <strong>"${cand.token}"</strong>
          <span class="cand-id">ID: ${cand.id}</span>
        </div>
        <div class="cand-bar-container">
          <div class="cand-bar-fill" style="width: ${cand.prob}%;"></div>
        </div>
        <div class="cand-prob-badge">${cand.prob}%</div>
      `;
      row.addEventListener('click', () => {
        sounds.playClick();
        this.currentText += cand.token;
        const customInput = this.container.querySelector('#llm-custom-input');
        if (customInput) customInput.value = this.currentText;
        this.generationStepIndex++;
        this.update();
      });
      list.appendChild(row);
    });
  }
}
