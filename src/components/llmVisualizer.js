import { sounds } from './soundEffects.js';
import { getLang, onLangChange, t } from '../i18n/index.js';

/**
 * Laboratorio Interactivo de Tokenización y LLM (Transformers) con Soporte Bilingüe
 */

export class LLMVisualizer {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentPresetKey = 'gato';
    this.isAutoplaying = false;
    this.autoPlayTimer = null;
    this.hoveredTokenIndex = null;

    this.presetsData = {
      es: {
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
                { token: ' quebrado', prob: 0.2, id: 29014 }
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
                { token: ' asiento', prob: 0.1, id: 11402 }
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
      },
      en: {
        gato: {
          title: 'The Curious Cat',
          initialText: 'The cat drank',
          steps: [
            {
              nextCandidates: [
                { token: ' milk', prob: 66, id: 1420 },
                { token: ' water', prob: 23, id: 2841 },
                { token: ' slowly', prob: 8, id: 9152 },
                { token: ' gasoline', prob: 0.1, id: 48902 }
              ],
              chosen: ' milk'
            },
            {
              nextCandidates: [
                { token: ' warm', prob: 51, id: 18991 },
                { token: ' and', prob: 38, id: 284 },
                { token: ' fresh', prob: 8, id: 14231 },
                { token: ' with', prob: 3, id: 412 }
              ],
              chosen: ' and'
            },
            {
              nextCandidates: [
                { token: ' purred', prob: 68, id: 312 },
                { token: ' then', prob: 18, id: 5120 },
                { token: ' meowed', prob: 10, id: 22104 },
                { token: ' ran', prob: 4, id: 18320 }
              ],
              chosen: ' purred'
            },
            {
              nextCandidates: [
                { token: ' softly', prob: 75, id: 16420 },
                { token: ' loudly', prob: 16, id: 4180 },
                { token: '.', prob: 9, id: 13 }
              ],
              chosen: ' softly'
            },
            {
              nextCandidates: [
                { token: '.', prob: 91, id: 13 },
                { token: ' happily', prob: 7, id: 24102 },
                { token: ' away', prob: 2, id: 265 }
              ],
              chosen: '.'
            }
          ]
        },
        bancoParque: {
          title: 'Meaning of "Bank" (Park Bench Context)',
          initialText: 'The park bench was',
          steps: [
            {
              nextCandidates: [
                { token: ' broken', prob: 54, id: 8240 },
                { token: ' wet', prob: 31, id: 12901 },
                { token: ' occupied', prob: 12, id: 17290 },
                { token: ' bankrupt', prob: 0.1, id: 29014 }
              ],
              chosen: ' broken'
            },
            {
              nextCandidates: [
                { token: ' and', prob: 50, id: 284 },
                { token: '.', prob: 38, id: 13 },
                { token: ' after', prob: 12, id: 450 }
              ],
              chosen: '.'
            }
          ]
        },
        bancoDinero: {
          title: 'Meaning of "Bank" (Financial Context)',
          initialText: 'I went to the bank to request a',
          steps: [
            {
              nextCandidates: [
                { token: ' loan', prob: 71, id: 9402 },
                { token: ' credit', prob: 20, id: 6204 },
                { token: ' statement', prob: 7, id: 18204 },
                { token: ' seat', prob: 0.1, id: 11402 }
              ],
              chosen: ' loan'
            },
            {
              nextCandidates: [
                { token: ' for', prob: 58, id: 22104 },
                { token: '.', prob: 32, id: 13 },
                { token: ' today', prob: 10, id: 5801 }
              ],
              chosen: '.'
            }
          ]
        }
      }
    };

    this.currentText = this.presets[this.currentPresetKey].initialText;
    this.generationStepIndex = 0;

    this.initDOM();
    this.update();

    onLangChange(() => {
      this.currentText = this.presets[this.currentPresetKey].initialText;
      this.generationStepIndex = 0;
      this.initDOM();
      this.update();
    });
  }

  get presets() {
    return this.presetsData[getLang()] || this.presetsData.es;
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="llm-section">
        <div class="module-intro">
          <div class="intro-badge"><i class="fa-solid fa-comments"></i> ${t('llm.badge')}</div>
          <h2>${t('llm.title')}</h2>
          <p>${t('llm.desc')}</p>
        </div>

        <!-- Barra de Presets y Control -->
        <div class="llm-toolbar">
          <div class="preset-selector-group">
            <label><i class="fa-solid fa-bookmark"></i> ${t('llm.examplesLabel')}</label>
            <div class="llm-preset-chips" id="llm-preset-chips"></div>
          </div>
          <div class="llm-input-row">
            <input type="text" id="llm-custom-input" class="llm-input-box" placeholder="${t('llm.customPlaceholder')}">
            <button class="btn-secondary" id="btn-llm-reset">
              <i class="fa-solid fa-rotate-left"></i> ${t('llm.resetPhrase')}
            </button>
          </div>
        </div>

        <!-- FASE 1: Tokenizador en Vivo -->
        <div class="llm-stage-card">
          <div class="stage-card-header">
            <div class="stage-title">
              <span class="stage-num-badge">${t('llm.stage1Badge')}</span>
              <div>
                <h3>${t('llm.stage1Title')}</h3>
                <span class="stage-subtitle">${t('llm.stage1Sub')}</span>
              </div>
            </div>
            <div class="token-count-indicator">Total: <strong id="token-total-count">0</strong> tokens</div>
          </div>

          <div class="tokenized-ribbon" id="tokenized-ribbon">
            <!-- Tokens animados generados dinámicamente -->
          </div>

          <div class="token-didactic-note">
            <i class="fa-solid fa-circle-info"></i>
            <span>${t('llm.note')}</span>
          </div>
        </div>

        <!-- FASE 2: Mecanismo de Auto-Atención (Self-Attention) -->
        <div class="llm-stage-card">
          <div class="stage-card-header">
            <div class="stage-title">
              <span class="stage-num-badge">${t('llm.stage2Badge')}</span>
              <div>
                <h3>${t('llm.stage2Title')}</h3>
                <span class="stage-subtitle">${t('llm.stage2Sub')}</span>
              </div>
            </div>
            <div class="attention-hint"><i class="fa-regular fa-hand-pointer"></i> ${t('llm.hoverHint')}</div>
          </div>

          <div class="attention-canvas-wrapper">
            <svg id="attention-svg" class="attention-svg"></svg>
            <div id="attention-tokens-bar" class="attention-tokens-bar"></div>
          </div>

          <div class="attention-expl-box" id="attention-expl-box">
            ${t('llm.explInitial')}
          </div>
        </div>

        <!-- FASE 3: Ruleta de Probabilidades y Generación Autorregresiva -->
        <div class="llm-stage-card">
          <div class="stage-card-header">
            <div class="stage-title">
              <span class="stage-num-badge">${t('llm.stage3Badge')}</span>
              <div>
                <h3>${t('llm.stage3Title')}</h3>
                <span class="stage-subtitle">${t('llm.stage3Sub')}</span>
              </div>
            </div>
            <div class="generation-controls">
              <button class="btn-primary" id="btn-next-token">
                <i class="fa-solid fa-wand-magic-sparkles"></i> ${t('llm.predictNextBtn')}
              </button>
              <button class="btn-secondary" id="btn-auto-generate">
                <i class="fa-solid fa-play"></i> <span id="auto-gen-text">${t('llm.autoGenBtn')}</span>
              </button>
            </div>
          </div>

          <div class="probabilities-grid">
            <div class="candidates-col">
              <div class="col-title">${t('llm.probColTitle')}</div>
              <div class="candidates-list" id="candidates-list">
                <!-- Barras de probabilidad animadas -->
              </div>
            </div>

            <div class="autoregressive-col">
              <div class="col-title">${t('llm.loopColTitle')}</div>
              <div class="loop-diagram">
                <div class="loop-step">
                  <span class="step-circle">1</span>
                  <span>${t('llm.loopStep1')}</span>
                </div>
                <div class="loop-arrow"><i class="fa-solid fa-arrow-down"></i></div>
                <div class="loop-step highlight">
                  <span class="step-circle">2</span>
                  <span>${t('llm.loopStep2')}</span>
                </div>
                <div class="loop-arrow"><i class="fa-solid fa-arrow-down"></i></div>
                <div class="loop-step">
                  <span class="step-circle">3</span>
                  <span>${t('llm.loopStep3')}</span>
                </div>
              </div>
              <div class="generated-preview" id="generated-preview">
                ...
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

    const customInput = this.container.querySelector('#llm-custom-input');
    if (customInput) customInput.value = this.currentText;

    const chips = this.container.querySelectorAll('.llm-preset-chip');
    chips.forEach(c => {
      c.classList.toggle('active', c.textContent.trim().includes(this.presets[key].title));
    });

    this.update();
  }

  tokenize(text) {
    if (!text || text.trim() === '') return [];

    const palette = [
      { bg: 'rgba(56, 189, 248, 0.2)', border: '#38bdf8', text: '#38bdf8' },
      { bg: 'rgba(168, 85, 247, 0.2)', border: '#a855f7', text: '#a855f7' },
      { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', text: '#22c55e' },
      { bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316', text: '#f97316' },
      { bg: 'rgba(236, 72, 153, 0.2)', border: '#ec4899', text: '#ec4899' },
      { bg: 'rgba(234, 179, 8, 0.2)', border: '#eab308', text: '#eab308' }
    ];

    const words = text.split(/(\s+)/);
    const tokens = [];

    words.forEach(word => {
      if (!word) return;

      if (/^\s+$/.test(word)) {
        return;
      }

      let subTokens = [word];
      const lower = word.toLowerCase();
      
      // Simulación de subpalabras BPE en español / inglés
      if (lower.endsWith('mente') && lower.length > 7) {
        subTokens = [word.slice(0, -5), 'mente'];
      } else if (lower.endsWith('ando') && lower.length > 6) {
        subTokens = [word.slice(0, -4), 'ando'];
      } else if (lower.endsWith('iendo') && lower.length > 7) {
        subTokens = [word.slice(0, -5), 'iendo'];
      } else if (lower.endsWith('tion') && lower.length > 6) {
        subTokens = [word.slice(0, -4), 'tion'];
      } else if (lower.endsWith('ing') && lower.length > 5) {
        subTokens = [word.slice(0, -3), 'ing'];
      }

      for (let i = 0; i < subTokens.length; i++) {
        const item = subTokens[i];
        const prefix = (i === 0 && tokens.length > 0) ? ' ' : '';
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
      const isEn = getLang() === 'en';
      const fallbackOptions = isEn ? [' and', ' with', ' for', ' always', ' then', '.'] : [' y', ' con', ' para', ' siempre', ' luego', '.'];
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
      const genTxt = this.container.querySelector('#auto-gen-text');
      if (genTxt) genTxt.textContent = t('llm.pauseGenBtn');
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
    const genTxt = this.container.querySelector('#auto-gen-text');
    if (genTxt) genTxt.textContent = t('llm.autoGenBtn');
    if (btn) btn.classList.remove('btn-warning');
  }

  update() {
    this.tokens = this.tokenize(this.currentText);
    this.renderTokenRibbon();
    this.renderAttention();
    this.renderPredictions();
  }

  renderTokenRibbon() {
    const ribbon = this.container.querySelector('#tokenized-ribbon');
    const countEl = this.container.querySelector('#token-total-count');
    if (countEl) countEl.textContent = this.tokens.length;
    if (!ribbon) return;

    ribbon.innerHTML = '';
    this.tokens.forEach((tok, idx) => {
      const card = document.createElement('div');
      card.className = 'token-chip-visual';
      card.style.background = tok.color.bg;
      card.style.borderColor = tok.color.border;
      card.innerHTML = `
        <span class="token-chip-text" style="color: ${tok.color.text}">${tok.display}</span>
        <span class="token-chip-id">ID: ${tok.id}</span>
      `;
      ribbon.appendChild(card);
    });

    const preview = this.container.querySelector('#generated-preview');
    if (preview) {
      preview.innerHTML = `
        <strong>${getLang() === 'en' ? 'Current Sentence:' : 'Frase generada:'}</strong> 
        "${this.currentText}"
      `;
    }
  }

  renderAttention() {
    const svg = this.container.querySelector('#attention-svg');
    const bar = this.container.querySelector('#attention-tokens-bar');
    if (!svg || !bar) return;

    bar.innerHTML = '';
    if (this.tokens.length === 0) {
      svg.innerHTML = '';
      return;
    }

    this.tokens.forEach((tok, idx) => {
      const pill = document.createElement('button');
      pill.className = `attention-token-pill ${idx === (this.hoveredTokenIndex !== null ? this.hoveredTokenIndex : this.tokens.length - 1) ? 'active' : ''}`;
      pill.textContent = tok.display;
      pill.addEventListener('mouseenter', () => {
        this.hoveredTokenIndex = idx;
        this.renderAttention();
      });
      pill.addEventListener('mouseleave', () => {
        this.hoveredTokenIndex = null;
        this.renderAttention();
      });
      bar.appendChild(pill);
    });

    const activeIdx = (this.hoveredTokenIndex !== null) ? this.hoveredTokenIndex : (this.tokens.length - 1);
    const activeToken = this.tokens[activeIdx];
    const pills = bar.querySelectorAll('.attention-token-pill');
    const svgRect = svg.getBoundingClientRect();
    const tokenPositions = [];

    pills.forEach(pill => {
      const pRect = pill.getBoundingClientRect();
      const midX = pRect.left + pRect.width / 2 - svgRect.left;
      tokenPositions.push(midX);
    });

    const baseY = svgRect.height - 25;
    let svgContent = '';

    for (let i = 0; i < this.tokens.length; i++) {
      if (i === activeIdx) continue;

      let weight = 0.2;
      const lowerCur = activeToken.display.toLowerCase();
      const lowerOther = this.tokens[i].display.toLowerCase();

      // Desambiguación didáctica banco/park/préstamo/loan
      if ((lowerCur.includes('banco') || lowerCur.includes('bank')) && (lowerOther.includes('parque') || lowerOther.includes('park') || lowerOther.includes('bench'))) {
        weight = 0.95;
      } else if ((lowerCur.includes('banco') || lowerCur.includes('bank')) && (lowerOther.includes('préstamo') || lowerOther.includes('loan') || lowerOther.includes('pedir') || lowerOther.includes('request'))) {
        weight = 0.95;
      } else if (lowerCur.includes('leche') || lowerCur.includes('milk') || lowerCur.includes('bebió') || lowerCur.includes('drank')) {
        weight = 0.85;
      } else {
        const dist = Math.abs(activeIdx - i);
        weight = Math.max(0.15, 0.85 - dist * 0.18);
      }

      const x1 = tokenPositions[activeIdx];
      const x2 = tokenPositions[i];
      const distance = Math.abs(x1 - x2);
      const arcHeight = Math.min(130, 30 + distance * 0.35);
      const midX = (x1 + x2) / 2;
      const controlY = baseY - arcHeight;

      const path = `M ${x1} ${baseY} Q ${midX} ${controlY} ${x2} ${baseY}`;
      const strokeColor = weight > 0.6 ? '#00f2fe' : (weight > 0.3 ? '#a855f7' : 'rgba(255, 255, 255, 0.12)');
      const strokeW = Math.max(1, weight * 4.5);
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

    if (activeIdx < tokenPositions.length) {
      svgContent += `
        <circle cx="${tokenPositions[activeIdx]}" cy="${baseY}" r="6" fill="#00f2fe" class="source-dot" />
      `;
    }

    svg.innerHTML = svgContent;

    const explBox = this.container.querySelector('#attention-expl-box');
    const isEn = getLang() === 'en';
    if (explBox && activeToken) {
      explBox.innerHTML = isEn ? `
        <strong>Focused Token:</strong> <span class="badge-token-focus">${activeToken.display}</span> 
        ➜ The self-attention mechanism scans all other tokens simultaneously. 
        Thicker and brighter cyan arcs indicate words receiving <strong>higher attention weights</strong> to resolve contextual semantics.
      ` : `
        <strong>Token enfocado:</strong> <span class="badge-token-focus">${activeToken.display}</span> 
        ➜ El mecanismo de auto-atención escanea todos los demás tokens de la frase a la vez. 
        Las líneas más gruesas y brillantes indican las palabras que <strong>mayor peso de atención</strong> reciben para fijar su significado.
      `;
    }
  }

  renderPredictions() {
    const list = this.container.querySelector('#candidates-list');
    if (!list) return;
    list.innerHTML = '';

    const preset = this.presets[this.currentPresetKey];
    let candidates = [];

    if (preset && preset.steps && this.generationStepIndex < preset.steps.length) {
      candidates = preset.steps[this.generationStepIndex].nextCandidates;
    } else {
      const isEn = getLang() === 'en';
      candidates = isEn ? [
        { token: ' and', prob: 45, id: 284 },
        { token: ' that', prob: 28, id: 350 },
        { token: '.', prob: 18, id: 13 },
        { token: ' when', prob: 9, id: 1402 }
      ] : [
        { token: ' y', prob: 45, id: 284 },
        { token: ' que', prob: 28, id: 350 },
        { token: '.', prob: 18, id: 13 },
        { token: ' cuando', prob: 9, id: 1402 }
      ];
    }

    candidates.forEach((cand, idx) => {
      const row = document.createElement('div');
      row.className = `candidate-row ${idx === 0 ? 'is-winner' : ''}`;
      row.innerHTML = `
        <div class="candidate-meta">
          <span class="candidate-token-label">"${cand.token}" <span class="candidate-token-id">ID: ${cand.id}</span></span>
          <span class="cand-prob-badge">${cand.prob}%</span>
        </div>
        <div class="cand-bar-track">
          <div class="cand-bar-fill" style="width: ${cand.prob}%;"></div>
        </div>
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
