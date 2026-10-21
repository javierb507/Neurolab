import { REAL_WORLD_PROBLEMS } from './nn/dataset.js';
import { NeuralNetwork } from './nn/network.js';
import { NetworkVisualizer } from './components/networkVisualizer.js';
import { DecisionBoundaryVisualizer } from './components/decisionBoundary.js';
import { LossChart } from './components/lossChart.js';
import { NeuronMicroscope } from './components/neuronMicroscope.js';
import { CNNVisualizer } from './components/cnnVisualizer.js';
import { RNNVisualizer } from './components/rnnVisualizer.js';
import { AcademyGuide } from './components/academyGuide.js';
import { sounds } from './components/soundEffects.js';

/**
 * NeuroLab App Controller
 * Orquesta los módulos de la aplicación, el bucle de entrenamiento,
 * la visualización reactiva y los casos reales.
 */
class NeuroLabApp {
  constructor() {
    this.currentProblemKey = 'diabetes';
    this.currentProblem = REAL_WORLD_PROBLEMS[this.currentProblemKey];
    this.noise = 0.10;
    this.trainRatio = 0.70;
    this.batchSize = 16;
    this.isTraining = false;
    this.trainingAnimationId = null;

    // Características de entrada seleccionadas
    this.enabledFeatures = {
      x1: true,
      x2: true,
      x1_sq: false,
      x2_sq: false,
      x1_x2: false,
      sin_x1: false,
      sin_x2: false
    };

    // Red Neuronal
    this.network = new NeuralNetwork({
      inputSize: 2,
      hiddenLayers: [4, 2],
      outputSize: 1,
      activation: 'relu',
      learningRate: 0.03,
      regularization: 'none',
      regularizationRate: 0.001,
      problemType: this.currentProblem.type
    });
    this.network.setFeatureConfig(this.enabledFeatures);

    this.initData();
    this.initDOM();
    this.initModules();
    this.bindEvents();
    this.renderAll();
  }

  initData() {
    const rawData = this.currentProblem.generate(260, this.noise);
    const splitIndex = Math.floor(rawData.length * this.trainRatio);
    this.trainData = rawData.slice(0, splitIndex);
    this.testData = rawData.slice(splitIndex);

    // Métricas iniciales
    this.network.computeMetrics(this.trainData, this.testData);
  }

  initDOM() {
    // Problem selector chips
    const chipsContainer = document.getElementById('problem-chips-container');
    chipsContainer.innerHTML = '';
    for (const [key, p] of Object.entries(REAL_WORLD_PROBLEMS)) {
      const btn = document.createElement('button');
      btn.className = `chip-problem ${key === this.currentProblemKey ? 'active' : ''}`;
      btn.innerHTML = `<i class="fa-solid ${p.icon}"></i> <span>${p.name.split(':')[0]}</span>`;
      btn.addEventListener('click', () => this.switchProblem(key));
      chipsContainer.appendChild(btn);
    }

    this.updateProblemStoryUI();
  }

  updateProblemStoryUI() {
    const p = this.currentProblem;
    document.getElementById('problem-cat-badge').textContent = p.category;
    document.getElementById('problem-title').textContent = p.name;
    document.getElementById('problem-desc').textContent = `${p.story} ${p.insight}`;

    document.getElementById('feat-1-name').textContent = p.feature1.name;
    document.getElementById('feat-1-range').textContent = `Rango típico: ${p.feature1.normalRange} (Total: ${p.feature1.min}-${p.feature1.max} ${p.feature1.unit})`;

    document.getElementById('feat-2-name').textContent = p.feature2.name;
    document.getElementById('feat-2-range').textContent = `Rango típico: ${p.feature2.normalRange} (Total: ${p.feature2.min}-${p.feature2.max} ${p.feature2.unit})`;

    // Leyenda de clases
    const legendEl = document.getElementById('problem-classes-legend');
    legendEl.innerHTML = p.classes.map(c => `
      <div class="p-class-item" style="color: ${c.color}">
        <span>${c.symbol}</span> <strong>${c.label}</strong>
      </div>
    `).join('');
  }

  initModules() {
    // 1. Visualizador de Red Sináptica
    const netContainer = document.getElementById('network-visualizer-container');
    this.netVis = new NetworkVisualizer(
      netContainer,
      (neuronData) => {
        sounds.playClick();
        this.microscope.inspect(neuronData, this.currentProblem);
      },
      (action, layerIdx) => this.handleArchitectureChange(action, layerIdx)
    );

    // 2. Visualizador de Frontera de Decisión
    const boundaryContainer = document.getElementById('decision-boundary-container');
    this.boundaryVis = new DecisionBoundaryVisualizer(boundaryContainer, () => {
      sounds.playStep();
    });

    // 3. Gráfico de Pérdida
    const lossContainer = document.getElementById('loss-chart-container');
    this.lossChart = new LossChart(lossContainer);

    // 4. Microscopio Neuronal
    const microscopeContainer = document.getElementById('neuron-microscope-container');
    this.microscope = new NeuronMicroscope(microscopeContainer);

    // 5. Módulo CNN
    const cnnContainer = document.getElementById('cnn-module-container');
    this.cnnModule = new CNNVisualizer(cnnContainer);

    // 6. Módulo RNN
    const rnnContainer = document.getElementById('rnn-module-container');
    this.rnnModule = new RNNVisualizer(rnnContainer);

    // 7. Módulo Academia
    const academyContainer = document.getElementById('academy-module-container');
    this.academyModule = new AcademyGuide(academyContainer, (mission) => this.applyMission(mission));
  }

  bindEvents() {
    // Pestañas Principales (Tab Navigation)
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        sounds.playClick();
        const tabKey = tab.getAttribute('data-tab');
        this.switchTab(tabKey);
      });
    });

    // Play / Pause
    const playBtn = document.getElementById('btn-play-pause');
    playBtn.addEventListener('click', () => {
      sounds.playClick();
      this.toggleTraining();
    });

    // Step 1 época
    document.getElementById('btn-step').addEventListener('click', () => {
      if (this.isTraining) this.stopTraining();
      sounds.playStep();
      this.trainOneStep();
      this.renderAll();
    });

    // Reset Pesos
    document.getElementById('btn-reset').addEventListener('click', () => {
      sounds.playClick();
      this.stopTraining();
      this.network.initWeights();
      this.network.computeMetrics(this.trainData, this.testData);
      this.renderAll();
    });

    // Hiperparámetros
    document.getElementById('select-lr').addEventListener('change', (e) => {
      sounds.playClick();
      this.network.learningRate = parseFloat(e.target.value);
    });

    document.getElementById('select-activation').addEventListener('change', (e) => {
      sounds.playClick();
      this.network.updateConfig({ activation: e.target.value });
      this.renderAll();
    });

    document.getElementById('select-reg').addEventListener('change', (e) => {
      sounds.playClick();
      this.network.updateConfig({ regularization: e.target.value });
    });

    document.getElementById('select-reg-rate').addEventListener('change', (e) => {
      sounds.playClick();
      this.network.updateConfig({ regularizationRate: parseFloat(e.target.value) });
    });

    // Ruido
    const noiseSlider = document.getElementById('slider-noise');
    noiseSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      document.getElementById('noise-display').textContent = `${val}%`;
      this.noise = val / 100;
      this.initData();
      this.renderAll();
    });

    // Ratio Train/Test
    const ratioSlider = document.getElementById('slider-ratio');
    ratioSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      document.getElementById('ratio-display').textContent = `${val}% / ${100 - val}%`;
      this.trainRatio = val / 100;
      this.initData();
      this.renderAll();
    });

    // Batch size buttons
    const batchBtns = document.querySelectorAll('.btn-batch');
    batchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sounds.playClick();
        batchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.batchSize = parseInt(btn.getAttribute('data-batch'), 10);
      });
    });

    // Regenerar datos
    document.getElementById('btn-regenerate-data').addEventListener('click', () => {
      sounds.playClick();
      this.initData();
      this.renderAll();
    });

    // Checkboxes de características (Feature Engineering)
    const featKeys = ['x1', 'x2', 'x1_sq', 'x2_sq', 'x1_x2', 'sin_x1', 'sin_x2'];
    featKeys.forEach(key => {
      const chk = document.getElementById(`feat-${key.replace('_', '-')}`);
      if (chk) {
        chk.addEventListener('change', (e) => {
          sounds.playClick();
          this.enabledFeatures[key] = e.target.checked;
          this.network.setFeatureConfig(this.enabledFeatures);
          this.renderAll();
        });
      }
    });

    // Sonido toggle
    const soundBtn = document.getElementById('btn-sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    soundBtn.addEventListener('click', () => {
      const isMuted = sounds.toggleMute();
      if (isMuted) {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundBtn.style.color = 'var(--text-dim)';
      } else {
        soundIcon.className = 'fa-solid fa-volume-high';
        soundBtn.style.color = 'var(--accent-cyan)';
        sounds.playClick();
      }
    });

    // Modal de Ayuda
    const guideModal = document.getElementById('modal-quick-guide');
    document.getElementById('btn-quick-guide').addEventListener('click', () => {
      sounds.playClick();
      guideModal.style.display = 'flex';
    });
    document.getElementById('btn-close-modal').addEventListener('click', () => {
      guideModal.style.display = 'none';
    });
    document.getElementById('btn-modal-got-it').addEventListener('click', () => {
      sounds.playClick();
      guideModal.style.display = 'none';
    });
  }

  switchTab(tabKey) {
    // Actualizar botones de pestaña
    document.querySelectorAll('.nav-tab').forEach(t => {
      const active = t.getAttribute('data-tab') === tabKey;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active);
    });

    // Mostrar vista correspondiente
    const views = ['mlp', 'cnn', 'rnn', 'academy'];
    views.forEach(v => {
      const viewEl = document.getElementById(`view-${v}`);
      if (viewEl) {
        viewEl.style.display = (v === tabKey) ? 'block' : 'none';
        viewEl.classList.toggle('active', v === tabKey);
      }
    });

    // Si salimos del playground, pausamos el entrenamiento para no consumir CPU
    if (tabKey !== 'mlp' && this.isTraining) {
      this.stopTraining();
    }

    if (tabKey === 'cnn' && this.cnnModule) {
      this.cnnModule.render();
    } else if (tabKey === 'rnn' && this.rnnModule) {
      this.rnnModule.render();
    }
  }

  switchProblem(problemKey) {
    sounds.playClick();
    this.currentProblemKey = problemKey;
    this.currentProblem = REAL_WORLD_PROBLEMS[problemKey];

    // Actualizar chips activos
    document.querySelectorAll('.chip-problem').forEach(c => {
      const isActive = c.textContent.trim().toLowerCase().includes(this.currentProblem.name.split(':')[0].toLowerCase());
      c.classList.toggle('active', isActive);
    });

    this.updateProblemStoryUI();
    this.initData();

    // Actualizar tipo de problema en la red
    this.network.updateConfig({ problemType: this.currentProblem.type });
    this.renderAll();
  }

  handleArchitectureChange(action, layerIdx) {
    sounds.playClick();
    const hidden = [...this.network.hiddenLayers];

    if (action === 'addLayer') {
      if (hidden.length < 5) {
        hidden.push(3); // Nueva capa con 3 neuronas por defecto
      }
    } else if (action === 'removeLayer') {
      if (hidden.length > 0) {
        hidden.pop();
      }
    } else if (action === 'addNeuron') {
      if (layerIdx >= 0 && layerIdx < hidden.length) {
        if (hidden[layerIdx] < 8) {
          hidden[layerIdx] += 1;
        }
      }
    } else if (action === 'removeNeuron') {
      if (layerIdx >= 0 && layerIdx < hidden.length) {
        if (hidden[layerIdx] > 1) {
          hidden[layerIdx] -= 1;
        }
      }
    }

    this.network.updateConfig({ hiddenLayers: hidden });
    this.renderAll();
  }

  toggleTraining() {
    if (this.isTraining) {
      this.stopTraining();
    } else {
      this.startTraining();
    }
  }

  startTraining() {
    this.isTraining = true;
    const btn = document.getElementById('btn-play-pause');
    const icon = document.getElementById('play-icon');
    const text = document.getElementById('play-text');

    btn.classList.add('playing');
    icon.className = 'fa-solid fa-pause';
    text.textContent = 'Pausar';

    let lastStepTime = 0;
    const loop = (timestamp) => {
      if (!this.isTraining) return;

      // Entrenar 1-2 épocas por frame para fluidez
      if (timestamp - lastStepTime > 30) {
        this.trainOneStep();
        this.renderAll();
        lastStepTime = timestamp;
      }

      this.trainingAnimationId = requestAnimationFrame(loop);
    };

    this.trainingAnimationId = requestAnimationFrame(loop);
  }

  stopTraining() {
    this.isTraining = false;
    if (this.trainingAnimationId) {
      cancelAnimationFrame(this.trainingAnimationId);
      this.trainingAnimationId = null;
    }

    const btn = document.getElementById('btn-play-pause');
    const icon = document.getElementById('play-icon');
    const text = document.getElementById('play-text');

    btn.classList.remove('playing');
    icon.className = 'fa-solid fa-play';
    text.textContent = 'Entrenar';
  }

  trainOneStep() {
    this.network.trainEpoch(this.trainData, this.testData, this.batchSize);

    // Si la precisión supera 96% por primera vez, chime suave
    if (this.network.testAccuracy >= 96 && !this.achievedHighAcc) {
      this.achievedHighAcc = true;
      sounds.playSuccess();
    }
  }

  applyMission(mission) {
    sounds.playSuccess();
    // Cambiar a vista MLP
    this.switchTab('mlp');

    // Cambiar al problema de la misión
    this.switchProblem(mission.problemId);

    // Aplicar configuración de la red
    const cfg = mission.config;
    document.getElementById('select-lr').value = cfg.learningRate;
    document.getElementById('select-activation').value = cfg.activation;
    document.getElementById('select-reg').value = cfg.regularization;

    this.network.updateConfig({
      hiddenLayers: cfg.hiddenLayers,
      activation: cfg.activation,
      learningRate: cfg.learningRate,
      regularization: cfg.regularization,
      regularizationRate: cfg.regularizationRate || 0.001
    });

    this.renderAll();
  }

  renderAll() {
    // Contador de época
    document.getElementById('epoch-counter').textContent = this.network.epoch;

    // Renderizar arquitectura de la red
    this.netVis.render(this.network, this.currentProblem);

    // Renderizar frontera de decisión
    this.boundaryVis.render(this.network, this.currentProblem, this.trainData, this.testData);

    // Renderizar curva de pérdida
    this.lossChart.render(this.network.lossHistory);

    // Actualizar microscopio si está abierto
    if (this.microscope.activeNeuronData) {
      this.microscope.inspect(this.microscope.activeNeuronData, this.currentProblem);
    }
  }
}

// Inicializar la aplicación cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  window.app = new NeuroLabApp();
});
