import { Activations } from '../nn/activations.js';
import { getLang, onLangChange, t } from '../i18n/index.js';

/**
 * Microscopio Neuronal (Neuron Inspector) con Soporte Bilingüe
 */

export class NeuronMicroscope {
  constructor(containerEl) {
    this.container = containerEl;
    this.activeNeuronData = null;
    this.lastProblem = null;
    this.initDOM();

    onLangChange(() => {
      if (this.activeNeuronData && this.lastProblem) {
        this.inspect(this.activeNeuronData, this.lastProblem);
      }
    });
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="microscope-card" id="microscope-card" style="display: none;">
        <div class="microscope-header">
          <div class="m-title">
            <i class="fa-solid fa-microscope"></i>
            <span id="m-neuron-title">${t('microscope.title')}</span>
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
    this.lastProblem = problem;
    const { layer, index, isInput, isOutput, network } = data;
    const isEn = getLang() === 'en';

    this.card.style.display = 'block';

    if (isInput) {
      const featName = index === 0 ? problem.feature1.name : (index === 1 ? problem.feature2.name : `${isEn ? 'Feature' : 'Característica'} #${index + 1}`);
      const featUnit = index === 0 ? problem.feature1.unit : (index === 1 ? problem.feature2.unit : '');
      const rawVal = network.lastInputs ? network.lastInputs[index] : 0;

      this.title.textContent = t('microscope.inputTitle', { name: featName });
      this.content.innerHTML = `
        <div class="m-input-expl">
          <div class="m-badge input-badge">${t('microscope.inputBadge')}</div>
          <p class="m-desc">${t('microscope.inputDesc')}</p>
          
          <div class="m-formula-box">
            <div class="formula-title">${t('microscope.normReceived')}</div>
            <div class="formula-val">${rawVal !== undefined ? rawVal.toFixed(3) : '0.000'}</div>
          </div>

          <div class="m-didactic-tip">
            <i class="fa-solid fa-lightbulb"></i>
            <span><strong>${t('microscope.normWhy')}</strong> ${t('microscope.normExplanation', { name: featName, unit: featUnit })}</span>
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

    this.title.textContent = isOutput 
      ? t('microscope.outputTitle') 
      : t('microscope.hiddenTitle', { index: index + 1, layer });

    this.content.innerHTML = `
      <div class="m-math-breakdown">
        <div class="m-badge ${isOutput ? 'output-badge' : 'hidden-badge'}">
          ${isOutput ? t('microscope.outputBadge') : t('microscope.hiddenBadge', { layer, act: act.name })}
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
                <th>${t('microscope.thInput')}</th>
                <th>${t('microscope.thVal')}</th>
                <th></th>
                <th>${t('microscope.thWeight')}</th>
                <th></th>
                <th>${t('microscope.thSubtotal')}</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
              <tr class="row-bias">
                <td colspan="5"><strong>${t('microscope.biasLabel')}</strong></td>
                <td><strong class="${b >= 0 ? 'w-pos' : 'w-neg'}">${b.toFixed(3)}</strong></td>
              </tr>
              <tr class="row-total">
                <td colspan="5"><strong>${t('microscope.zTotal')}</strong></td>
                <td><span class="z-badge">${totalZ.toFixed(3)}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="m-activation-result">
          <div class="act-formula">
            <span>${t('microscope.actFinal', { act: act.name })} </span>
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
    const isEn = getLang() === 'en';
    if (isOutput) {
      const pct = Math.round(a * 100);
      return isEn 
        ? `As the output neuron with Sigmoid activation, the value is compressed between 0 and 1, interpreted as a probability of <strong>${pct}%</strong>.`
        : `Como es la neurona de salida con función Sigmoide, el valor se comprime entre 0 y 1, interpretándose como una probabilidad del <strong>${pct}%</strong>.`;
    }

    if (actName === 'relu') {
      if (z <= 0) {
        return isEn
          ? `Since <em>z ≤ 0</em> (${z.toFixed(2)}), ReLU yields <strong>0</strong>. The neuron is 'silenced' (inhibited) and passes no activation to the next layer.`
          : `Dado que <em>z ≤ 0</em> (${z.toFixed(2)}), ReLU devuelve <strong>0</strong>. La neurona está 'silenciada' y no transmite señal hacia la siguiente capa.`;
      } else {
        return isEn
          ? `Since <em>z > 0</em> (${z.toFixed(2)}), ReLU lets the signal pass identically as <strong>${a.toFixed(2)}</strong>. The neuron is active.`
          : `Como <em>z > 0</em> (${z.toFixed(2)}), ReLU deja pasar la señal idéntica a <strong>${a.toFixed(2)}</strong>. La neurona está 'activa'.`;
      }
    } else if (actName === 'tanh') {
      return isEn
        ? `Tanh smoothly squashes the linear sum between [-1 and 1]. At z = ${z.toFixed(2)}, the neuron transmits an activation of <strong>${a.toFixed(2)}</strong>.`
        : `Tanh comprime la suma lineal suavemente entre [-1 y 1]. Con z = ${z.toFixed(2)}, la neurona transmite una fuerza de <strong>${a.toFixed(2)}</strong>.`;
    } else if (actName === 'sigmoid') {
      return isEn
        ? `Sigmoid scales any real value into (0, 1). A value of z = ${z.toFixed(2)} yields an activation of <strong>${a.toFixed(2)}</strong>.`
        : `Sigmoide comprime cualquier número real entre 0 y 1. Un valor z = ${z.toFixed(2)} resulta en una activación de <strong>${a.toFixed(2)}</strong>.`;
    }
    return '';
  }
}
