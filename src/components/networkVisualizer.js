/**
 * Visualizador interactivo de Arquitectura de Red Neuronal
 * Renderiza capas, neuronas, sinapsis con grosor según pesos, sesgos (bias)
 * y pulsos de señal interactivos. Permite inspeccionar cualquier neurona.
 */

export class NetworkVisualizer {
  constructor(containerEl, onNeuronClick, onArchitectureChange) {
    this.container = containerEl;
    this.onNeuronClick = onNeuronClick;
    this.onArchitectureChange = onArchitectureChange;
    this.selectedNeuron = null;
    this.pulseTime = 0;

    this.initDOM();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="network-vis-wrapper">
        <div class="vis-toolbar">
          <div class="vis-title">
            <i class="fa-solid fa-network-wired"></i>
            <span>Arquitectura Sináptica en Vivo</span>
          </div>
          <div class="layer-global-controls">
            <span class="ctrl-label">Capas Ocultas:</span>
            <button id="btn-remove-layer" class="btn-sm" title="Quitar capa oculta">
              <i class="fa-solid fa-minus"></i>
            </button>
            <span id="hidden-layers-count" class="layer-badge">2 capas</span>
            <button id="btn-add-layer" class="btn-sm" title="Añadir capa oculta">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>

        <div class="canvas-container">
          <svg id="network-svg" class="network-svg"></svg>
          <div id="synapse-tooltip" class="synapse-tooltip"></div>
        </div>

        <div class="vis-legend">
          <div class="legend-item"><span class="legend-line pos"></span> Peso positivo (+)</div>
          <div class="legend-item"><span class="legend-line neg"></span> Peso negativo (-)</div>
          <div class="legend-item"><span class="legend-dot active"></span> Alta activación</div>
          <div class="legend-item"><span class="legend-dot inspect"></span> Haz clic en una neurona para inspeccionar</div>
        </div>
      </div>
    `;

    this.svg = this.container.querySelector('#network-svg');
    this.tooltip = this.container.querySelector('#synapse-tooltip');
    this.layersCountBadge = this.container.querySelector('#hidden-layers-count');

    // Bind controls
    this.container.querySelector('#btn-add-layer').addEventListener('click', () => {
      if (this.onArchitectureChange) this.onArchitectureChange('addLayer');
    });
    this.container.querySelector('#btn-remove-layer').addEventListener('click', () => {
      if (this.onArchitectureChange) this.onArchitectureChange('removeLayer');
    });

    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    if (this.lastNetwork) {
      this.render(this.lastNetwork, this.lastDataset);
    }
  }

  render(network, dataset) {
    this.lastNetwork = network;
    this.lastDataset = dataset;
    if (!this.svg) return;

    const width = this.svg.clientWidth || this.svg.parentElement.clientWidth || 650;
    const height = Math.max(380, this.svg.clientHeight || 380);
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.layersCountBadge.textContent = `${network.hiddenLayers.length} capa${network.hiddenLayers.length === 1 ? '' : 's'}`;

    const layerSizes = network.layerSizes;
    const numLayers = layerSizes.length;
    const startX = 115;
    const endX = width - 85;
    const colSpacing = numLayers > 1 ? (endX - startX) / (numLayers - 1) : 0;

    // Calcular coordenadas (x, y) de cada neurona
    const neuronCoords = [];
    for (let l = 0; l < numLayers; l++) {
      const count = layerSizes[l];
      const x = startX + l * colSpacing;
      const coords = [];
      const rowSpacing = Math.min(55, (height - 110) / Math.max(1, count - 1));
      const totalColHeight = (count - 1) * rowSpacing;
      const startY = (height / 2) - (totalColHeight / 2) + 15;

      for (let j = 0; j < count; j++) {
        const y = count === 1 ? height / 2 + 15 : startY + j * rowSpacing;
        coords.push({ x, y, layer: l, index: j });
      }
      neuronCoords.push(coords);
    }

    // Generar SVG Content
    let svgContent = '';

    // 1. Capas y Sinapsis (Conexiones)
    for (let l = 0; l < network.layers.length; l++) {
      const layer = network.layers[l];
      const fromCoords = neuronCoords[l];
      const toCoords = neuronCoords[l + 1];

      for (let j = 0; j < layer.outDim; j++) {
        const to = toCoords[j];
        for (let i = 0; i < layer.inDim; i++) {
          const from = fromCoords[i];
          const w = layer.W[j][i];
          const absW = Math.abs(w);
          const strokeWidth = Math.min(6, Math.max(0.8, absW * 2.2));
          const color = w >= 0 ? '#00f2fe' : '#ff4b4b';
          const opacity = Math.min(0.9, Math.max(0.18, absW * 0.75));

          // Curva Bezier suave
          const midX = (from.x + to.x) / 2;
          const path = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;

          svgContent += `
            <path d="${path}" 
              stroke="${color}" 
              stroke-width="${strokeWidth}" 
              stroke-opacity="${opacity}" 
              fill="none" 
              class="synapse-path"
              data-w="${w.toFixed(3)}"
              data-from="${l}-${i}"
              data-to="${l + 1}-${j}"
            />
          `;
        }
      }
    }

    // 2. Títulos de Capas y Controles individuales (+ / - neuronas)
    for (let l = 0; l < numLayers; l++) {
      const x = neuronCoords[l][0].x;
      let title = '';
      let isHidden = false;

      if (l === 0) {
        title = 'Entrada (Features)';
      } else if (l === numLayers - 1) {
        title = 'Salida';
      } else {
        title = `Oculta ${l}`;
        isHidden = true;
      }

      svgContent += `
        <text x="${x}" y="24" text-anchor="middle" class="layer-header-text">${title}</text>
      `;

      if (isHidden) {
        // Botones SVG interactivos de +/- neuronas
        svgContent += `
          <g class="layer-neuron-ctrls" transform="translate(${x}, 42)">
            <circle cx="-16" cy="0" r="10" class="ctrl-circle minus-neuron" data-layer-idx="${l - 1}" />
            <text x="-16" y="4" text-anchor="middle" class="ctrl-icon-text minus-neuron" data-layer-idx="${l - 1}">-</text>
            
            <circle cx="16" cy="0" r="10" class="ctrl-circle add-neuron" data-layer-idx="${l - 1}" />
            <text x="16" y="4" text-anchor="middle" class="ctrl-icon-text add-neuron" data-layer-idx="${l - 1}">+</text>
          </g>
        `;
      }
    }

    // 3. Nodos (Neuronas)
    for (let l = 0; l < numLayers; l++) {
      const isInput = (l === 0);
      const isOutput = (l === numLayers - 1);
      const isSelected = this.selectedNeuron && this.selectedNeuron.layer === l;

      for (let j = 0; j < layerSizes[l]; j++) {
        const coord = neuronCoords[l][j];
        let val = 0;
        let bias = 0;
        let label = '';

        if (isInput) {
          val = (network.lastInputs && network.lastInputs[j] !== undefined) ? network.lastInputs[j] : 0;
          if (dataset) {
            if (j === 0) label = dataset.feature1 ? dataset.feature1.name.split(':')[0] : 'x₁';
            else if (j === 1) label = dataset.feature2 ? dataset.feature2.name.split(':')[0] : 'x₂';
            else label = `feat ${j + 1}`;
          } else {
            label = `x${j + 1}`;
          }
        } else {
          const layerObj = network.layers[l - 1];
          val = layerObj.a ? layerObj.a[j] : 0;
          bias = layerObj.b ? layerObj.b[j] : 0;
          label = isOutput ? 'ŷ' : `n${j + 1}`;
        }

        const isCurrentlySelected = this.selectedNeuron && 
          this.selectedNeuron.layer === l && 
          this.selectedNeuron.index === j;

        // Color de activación: interpolación suave
        const normVal = Math.max(-1, Math.min(1, val));
        let fillColor = '#1e293b';
        let glowColor = 'none';

        if (normVal > 0.05) {
          fillColor = `rgba(0, 242, 254, ${Math.min(0.9, 0.2 + normVal * 0.7)})`;
          glowColor = '0 0 10px rgba(0, 242, 254, 0.6)';
        } else if (normVal < -0.05) {
          fillColor = `rgba(255, 75, 75, ${Math.min(0.9, 0.2 + Math.abs(normVal) * 0.7)})`;
          glowColor = '0 0 10px rgba(255, 75, 75, 0.6)';
        }

        const radius = isOutput ? 22 : (isInput ? 19 : 17);

        svgContent += `
          <g class="neuron-node ${isCurrentlySelected ? 'selected' : ''}" 
             data-layer="${l}" 
             data-index="${j}" 
             transform="translate(${coord.x}, ${coord.y})"
             style="cursor: pointer;">
            
            <!-- Anillo exterior o halo de bias -->
            ${!isInput ? `
              <circle cx="0" cy="0" r="${radius + 4}" 
                      fill="none" 
                      stroke="${bias >= 0 ? '#38bdf8' : '#f87171'}" 
                      stroke-width="1.8" 
                      stroke-dasharray="3, 3" 
                      opacity="0.75" />
            ` : ''}

            <!-- Círculo principal de la neurona -->
            <circle cx="0" cy="0" r="${radius}" 
                    class="neuron-body"
                    fill="${fillColor}" 
                    stroke="${isCurrentlySelected ? '#f59e0b' : '#334155'}" 
                    stroke-width="${isCurrentlySelected ? '3' : '2'}" />

            <!-- Texto de etiqueta / valor dentro del nodo -->
            <text x="0" y="3.5" text-anchor="middle" class="neuron-text">${val !== undefined ? Number(val).toFixed(2) : label}</text>

            ${!isInput && !isOutput ? `
              <text x="0" y="${radius + 14}" text-anchor="middle" class="bias-text">b:${bias.toFixed(2)}</text>
            ` : ''}

            ${isInput ? `
              <text x="-26" y="4" text-anchor="end" class="feat-tag-left">${label}</text>
            ` : ''}

            ${isOutput ? `
              <text x="0" y="${radius + 15}" text-anchor="middle" class="bias-text">b:${bias.toFixed(2)}</text>
              <text x="32" y="4" text-anchor="start" class="feat-tag-right">ŷ (Salida)</text>
            ` : ''}
          </g>
        `;
      }
    }

    this.svg.innerHTML = svgContent;
    this.attachEventListeners(network);
  }

  attachEventListeners(network) {
    // Tooltip sobre sinapsis
    const paths = this.svg.querySelectorAll('.synapse-path');
    paths.forEach(p => {
      p.addEventListener('mouseenter', (e) => {
        const w = p.getAttribute('data-w');
        const from = p.getAttribute('data-from');
        const to = p.getAttribute('data-to');
        this.tooltip.style.display = 'block';
        this.tooltip.innerHTML = `<strong>Conexión Sináptica:</strong><br>Peso (w): <span class="${parseFloat(w) >= 0 ? 'pos-val' : 'neg-val'}">${w}</span>`;
        const rect = this.svg.getBoundingClientRect();
        this.tooltip.style.left = `${e.clientX - rect.left + 10}px`;
        this.tooltip.style.top = `${e.clientY - rect.top - 30}px`;
      });
      p.addEventListener('mouseleave', () => {
        this.tooltip.style.display = 'none';
      });
    });

    // Clic en neurona para abrir "Microscopio Neuronal"
    const nodes = this.svg.querySelectorAll('.neuron-node');
    nodes.forEach(n => {
      n.addEventListener('click', () => {
        const layer = parseInt(n.getAttribute('data-layer'), 10);
        const index = parseInt(n.getAttribute('data-index'), 10);
        this.selectedNeuron = { layer, index };
        
        // Actualizar selección visual
        nodes.forEach(other => other.classList.remove('selected'));
        n.classList.add('selected');

        if (this.onNeuronClick) {
          this.onNeuronClick({
            layer,
            index,
            isInput: layer === 0,
            isOutput: layer === network.layerSizes.length - 1,
            network
          });
        }
      });
    });

    // Botones +/- de neuronas por capa oculta
    const plusButtons = this.svg.querySelectorAll('.add-neuron');
    plusButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const layerIdx = parseInt(btn.getAttribute('data-layer-idx'), 10);
        if (this.onArchitectureChange) {
          this.onArchitectureChange('addNeuron', layerIdx);
        }
      });
    });

    const minusButtons = this.svg.querySelectorAll('.minus-neuron');
    minusButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const layerIdx = parseInt(btn.getAttribute('data-layer-idx'), 10);
        if (this.onArchitectureChange) {
          this.onArchitectureChange('removeNeuron', layerIdx);
        }
      });
    });
  }
}
