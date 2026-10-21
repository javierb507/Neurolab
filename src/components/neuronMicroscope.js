import { Activations } from '../nn/activations.js';

/**
 * Microscopio Neuronal (Neuron Inspector)
 * Desglosa la matemática exacta de una neurona individual seleccionada:
 * Entradas, pesos sinápticos, suma ponderada z, bias y activación a = f(z).
 */

export class NeuronMicroscope {
  constructor(containerEl) {
    this.container = containerEl;
    this.activeNeuronData = null;
    this.initDOM();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="microscope-card" id="microscope-card" style="display: none;">
        <div class="microscope-header">
          <div class="m-title">
            <i class="fa-solid fa-microscope"></i>
            <span id="m-neuron-title">Microscopio Neuronal</span>
          </div>
          <button class="btn-close-m" id="btn-close-microscope">&times;</button>
        </div>

        <div class="microscope-body" id="microscope-content">
          <!-- Contenido generado dinámicamente -->
        </div>
      </div>
    `;

    this.card = this.container.querySelector('#microscope-card');
    this.content = this.container.querySelector('#microscope-content');
    this.title = this.container.querySelector('#m-neuron-title');

    this.container.querySelector('#btn-close-microscope').addEventListener('click', () => {
      this.card.style.display = 'none';
      this.activeNeuronData = null;
    });
  }

  inspect(data, problem) {
    if (!data) return;
    this.activeNeuronData = data;
    const { layer, index, isInput, isOutput, network } = data;

    this.card.style.display = 'block';

    if (isInput) {
      // Neurona de entrada
      const featName = index === 0 ? problem.feature1.name : (index === 1 ? problem.feature2.name : `Característica #${index + 1}`);
      const featUnit = index === 0 ? problem.feature1.unit : (index === 1 ? problem.feature2.unit : '');
      const rawVal = network.lastInputs ? network.lastInputs[index] : 0;

      this.title.textContent = `Neurona de Entrada: ${featName}`;
      this.content.innerHTML = `
        <div class="m-input-expl">
          <div class="m-badge input-badge">Capa de Entrada (Input Layer)</div>
          <p class="m-desc">Esta neurona no tiene pesos previos; recibe directamente la señal del mundo exterior normalizada en el rango [-1, 1].</p>
          
          <div class="m-formula-box">
            <div class="formula-title">Valor Normalizado Recibido:</div>
            <div class="formula-val">${rawVal !== undefined ? rawVal.toFixed(3) : '0.000'}</div>
          </div>

          <div class="m-didactic-tip">
            <i class="fa-solid fa-lightbulb"></i>
            <span><strong>¿Por qué normalizar?</strong> Las redes aprenden mucho más rápido cuando las variables (como ${featName} en ${featUnit}) se escalan alrededor de cero, evitando que una variable de magnitud grande opaque a las demás.</span>
          </div>
        </div>
      `;
      return;
    }

    // Neurona oculta o de salida
    const layerObj = network.layers[layer - 1];
    const actName = layerObj.activation;
    const act = Activations[actName] || Activations.relu;
    const b = layerObj.b[index];
    const prevA = (layer === 1) ? network.lastInputs : network.layers[layer - 2].a;

    // Calcular desglose de entradas y pesos
    let tableRows = '';
    let totalZ = b;

    for (let i = 0; i < layerObj.inDim; i++) {
      const inputVal = prevA ? (prevA[i] || 0) : 0;
      const w = layerObj.W[index][i];
      const product = inputVal * w;
      totalZ += product;

      tableRows += `
        <tr>
          <td><span class="m-node-ref">a<sub>${i + 1}</sub></span></td>
          <td>${inputVal.toFixed(3)}</td>
          <td>&times;</td>
          <td><span class="${w >= 0 ? 'w-pos' : 'w-neg'}">${w.toFixed(3)}</span></td>
          <td>=</td>
          <td><strong>${product.toFixed(3)}</strong></td>
        </tr>
      `;
    }

    const finalA = act.fn(totalZ);

    this.title.textContent = isOutput ? `Neurona de Salida (ŷ)` : `Neurona #${index + 1} en Capa Oculta ${layer}`;

    this.content.innerHTML = `
      <div class="m-math-breakdown">
        <div class="m-badge ${isOutput ? 'output-badge' : 'hidden-badge'}">
          ${isOutput ? 'Capa de Salida (Predicción Final)' : `Capa Oculta ${layer} | Activación: ${act.name}`}
        </div>

        <div class="m-formula-code">
          <span class="m-math">z = ∑(wᵢ · aᵢ) + b</span>
          <span class="m-math-arrow">➜</span>
          <span class="m-math">a = ${act.name}(z)</span>
        </div>

        <div class="m-table-container">
          <table class="m-calc-table">
            <thead>
              <tr>
                <th>Entrada</th>
                <th>Valor (aᵢ)</th>
                <th></th>
                <th>Peso (wᵢ)</th>
                <th></th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              <tr class="row-bias">
                <td colspan="5"><strong>+ Sesgo (Bias b):</strong></td>
                <td><strong class="${b >= 0 ? 'w-pos' : 'w-neg'}">${b.toFixed(3)}</strong></td>
              </tr>
              <tr class="row-total">
                <td colspan="5"><strong>Suma Neta Lineal (z):</strong></td>
                <td><span class="z-badge">${totalZ.toFixed(3)}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="m-activation-result">
          <div class="act-formula">
            <span>Activación: <strong>${act.name}(${totalZ.toFixed(3)})</strong> = </span>
            <span class="act-final-val">${finalA.toFixed(4)}</span>
          </div>
          <div class="act-explanation">
            ${this.getExplanationText(actName, totalZ, finalA, isOutput)}
          </div>
        </div>
      </div>
    `;
  }

  getExplanationText(actName, z, a, isOutput) {
    if (isOutput) {
      const pct = Math.round(a * 100);
      return `Como es la neurona de salida con función Sigmoide, el valor se comprime entre 0 y 1, interpretándose como una probabilidad del <strong>${pct}%</strong>.`;
    }

    if (actName === 'relu') {
      if (z <= 0) {
        return `Dado que <em>z ≤ 0</em> (${z.toFixed(2)}), ReLU devuelve <strong>0</strong>. La neurona está 'silenciada' y no transmite señal hacia la siguiente capa.`;
      } else {
        return `Como <em>z > 0</em> (${z.toFixed(2)}), ReLU deja pasar la señal idéntica a <strong>${a.toFixed(2)}</strong>. La neurona está 'activa'.`;
      }
    } else if (actName === 'tanh') {
      return `Tanh comprime la suma lineal suavemente entre [-1 y 1]. Con z = ${z.toFixed(2)}, la neurona transmite una fuerza de <strong>${a.toFixed(2)}</strong>.`;
    } else if (actName === 'sigmoid') {
      return `Sigmoide comprime cualquier número real entre 0 y 1. Un valor z = ${z.toFixed(2)} resulta en una activación de <strong>${a.toFixed(2)}</strong>.`;
    }
    return `La neurona procesa la información y emite <strong>${a.toFixed(3)}</strong>.`;
  }
}
