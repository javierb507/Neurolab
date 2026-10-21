import { Activations } from './activations.js';

/**
 * Motor de Red Neuronal Profunda Multicapa (MLP)
 * Implementa forward pass, backpropagation, optimizador Adam/SGD y regularización L1/L2.
 * Totalmente configurable e inspeccionable paso a paso.
 */
export class NeuralNetwork {
  constructor(config = {}) {
    this.inputSize = config.inputSize || 2;
    this.hiddenLayers = config.hiddenLayers || [4, 2]; // e.g. [4, 2]
    this.outputSize = config.outputSize || 1;
    this.activationName = config.activation || 'relu';
    this.learningRate = config.learningRate !== undefined ? config.learningRate : 0.03;
    this.regularization = config.regularization || 'none'; // 'none' | 'l1' | 'l2'
    this.regularizationRate = config.regularizationRate || 0.001;
    this.problemType = config.problemType || 'classification'; // 'classification' | 'regression'

    this.epoch = 0;
    this.lossHistory = [];
    this.trainLoss = 0;
    this.testLoss = 0;
    this.trainAccuracy = 0;
    this.testAccuracy = 0;

    this.initWeights();
  }

  /**
   * Inicialización de pesos (He initialization para ReLU, Xavier/Glorot para Tanh/Sigmoid)
   */
  initWeights() {
    this.epoch = 0;
    this.lossHistory = [];
    this.layerSizes = [this.inputSize, ...this.hiddenLayers, this.outputSize];
    this.layers = [];

    // Por cada transición entre capas:
    for (let l = 0; l < this.layerSizes.length - 1; l++) {
      const inDim = this.layerSizes[l];
      const outDim = this.layerSizes[l + 1];
      const isOutput = (l === this.layerSizes.length - 2);

      // Desviación estándar de inicialización
      let std = Math.sqrt(2 / inDim); // He init
      if (this.activationName === 'tanh' || this.activationName === 'sigmoid') {
        std = Math.sqrt(2 / (inDim + outDim)); // Xavier init
      }

      const W = [];
      const dW = [];
      const mW = []; // Adam first moment
      const vW = []; // Adam second moment

      for (let j = 0; j < outDim; j++) {
        W[j] = [];
        dW[j] = [];
        mW[j] = [];
        vW[j] = [];
        for (let i = 0; i < inDim; i++) {
          // Normal Box-Muller
          const u1 = Math.random() || 1e-7;
          const u2 = Math.random() || 1e-7;
          const randNormal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          W[j][i] = randNormal * std;
          dW[j][i] = 0;
          mW[j][i] = 0;
          vW[j][i] = 0;
        }
      }

      const b = new Array(outDim).fill(0.01);
      const db = new Array(outDim).fill(0);
      const mb = new Array(outDim).fill(0);
      const vb = new Array(outDim).fill(0);

      this.layers.push({
        inDim,
        outDim,
        W,
        b,
        dW,
        db,
        mW,
        vW,
        mb,
        vb,
        isOutput,
        activation: isOutput 
          ? (this.problemType === 'classification' ? 'sigmoid' : 'linear') 
          : this.activationName,
        // Almacenes temporales para forward pass
        z: new Array(outDim).fill(0),
        a: new Array(outDim).fill(0),
        delta: new Array(outDim).fill(0)
      });
    }

    this.adamT = 0;
  }

  /**
   * Reconfigura hiperparámetros sin recrear pesos innecesariamente
   */
  updateConfig({ hiddenLayers, activation, learningRate, regularization, regularizationRate, problemType }) {
    let reinit = false;
    if (hiddenLayers && JSON.stringify(hiddenLayers) !== JSON.stringify(this.hiddenLayers)) {
      this.hiddenLayers = [...hiddenLayers];
      reinit = true;
    }
    if (activation && activation !== this.activationName) {
      this.activationName = activation;
      reinit = true;
    }
    if (problemType && problemType !== this.problemType) {
      this.problemType = problemType;
      reinit = true;
    }
    if (learningRate !== undefined) this.learningRate = learningRate;
    if (regularization !== undefined) this.regularization = regularization;
    if (regularizationRate !== undefined) this.regularizationRate = regularizationRate;

    if (reinit) {
      this.initWeights();
    }
  }

  /**
   * Forward pass para un único vector de entrada
   * Retorna la salida y almacena activaciones para visualización
   */
  forward(inputs) {
    let currentA = [...inputs];
    this.lastInputs = currentA;

    for (let l = 0; l < this.layers.length; l++) {
      const layer = this.layers[l];
      const act = Activations[layer.activation] || Activations.relu;
      const nextA = new Array(layer.outDim);

      for (let j = 0; j < layer.outDim; j++) {
        let sum = layer.b[j];
        for (let i = 0; i < layer.inDim; i++) {
          sum += layer.W[j][i] * currentA[i];
        }
        layer.z[j] = sum;
        nextA[j] = act.fn(sum);
        layer.a[j] = nextA[j];
      }

      currentA = nextA;
    }

    return currentA[0]; // 1 neurona de salida
  }

  /**
   * Ejecuta 1 época de entrenamiento con un lote de datos
   * Optimización Adam rápida y estable
   */
  trainEpoch(trainData, testData, batchSize = 16) {
    if (!trainData || trainData.length === 0) return;

    // Reset de acumuladores de gradiente
    for (const layer of this.layers) {
      for (let j = 0; j < layer.outDim; j++) {
        layer.db[j] = 0;
        for (let i = 0; i < layer.inDim; i++) {
          layer.dW[j][i] = 0;
        }
      }
    }

    // Mini-batch sampling aleatorio
    const n = trainData.length;
    const actualBatchSize = Math.min(batchSize, n);
    const indices = [];
    for (let k = 0; k < actualBatchSize; k++) {
      indices.push(Math.floor(Math.random() * n));
    }

    let batchLoss = 0;

    for (const idx of indices) {
      const sample = trainData[idx];
      const target = sample.label !== undefined ? sample.label : sample.targetValue;
      
      // 1. Forward Pass guardando estados
      const inputVector = this.extractFeatures(sample);
      const output = this.forward(inputVector);

      // 2. Pérdida
      if (this.problemType === 'classification') {
        const p = Math.max(1e-7, Math.min(1 - 1e-7, output));
        batchLoss += -(target * Math.log(p) + (1 - target) * Math.log(1 - p));
      } else {
        batchLoss += 0.5 * Math.pow(output - target, 2);
      }

      // 3. Backpropagation
      const numLayers = this.layers.length;
      const outputLayer = this.layers[numLayers - 1];

      // Error en capa de salida
      // Para clasificación con Sigmoide + BCE: delta = (output - target)
      // Para regresión lineal + MSE: delta = (output - target)
      for (let j = 0; j < outputLayer.outDim; j++) {
        outputLayer.delta[j] = (output - target);
      }

      // Propagación hacia capas ocultas anteriores
      for (let l = numLayers - 2; l >= 0; l--) {
        const layer = this.layers[l];
        const nextLayer = this.layers[l + 1];
        const act = Activations[layer.activation] || Activations.relu;

        for (let i = 0; i < layer.outDim; i++) {
          let errSum = 0;
          for (let j = 0; j < nextLayer.outDim; j++) {
            errSum += nextLayer.W[j][i] * nextLayer.delta[j];
          }
          const dAct = act.deriv(layer.z[i]);
          layer.delta[i] = errSum * dAct;
        }
      }

      // Acumular gradientes dW y db
      for (let l = 0; l < numLayers; l++) {
        const layer = this.layers[l];
        const prevA = (l === 0) ? inputVector : this.layers[l - 1].a;

        for (let j = 0; j < layer.outDim; j++) {
          layer.db[j] += layer.delta[j];
          for (let i = 0; i < layer.inDim; i++) {
            layer.dW[j][i] += layer.delta[j] * prevA[i];
          }
        }
      }
    }

    // Normalizar por tamaño del batch y aplicar Regularización + Adam Optimizer
    this.adamT += 1;
    const beta1 = 0.9;
    const beta2 = 0.999;
    const eps = 1e-8;
    const lr = this.learningRate;
    const mFactor = 1 / actualBatchSize;

    for (let l = 0; l < this.layers.length; l++) {
      const layer = this.layers[l];

      for (let j = 0; j < layer.outDim; j++) {
        // Bias update (Adam)
        const gB = layer.db[j] * mFactor;
        layer.mb[j] = beta1 * layer.mb[j] + (1 - beta1) * gB;
        layer.vb[j] = beta2 * layer.vb[j] + (1 - beta2) * (gB * gB);

        const mbHat = layer.mb[j] / (1 - Math.pow(beta1, this.adamT));
        const vbHat = layer.vb[j] / (1 - Math.pow(beta2, this.adamT));
        layer.b[j] -= (lr / (Math.sqrt(vbHat) + eps)) * mbHat;

        // Weights update (Adam + Regularización)
        for (let i = 0; i < layer.inDim; i++) {
          let gW = layer.dW[j][i] * mFactor;

          if (this.regularization === 'l2') {
            gW += this.regularizationRate * layer.W[j][i];
          } else if (this.regularization === 'l1') {
            gW += this.regularizationRate * Math.sign(layer.W[j][i]);
          }

          layer.mW[j][i] = beta1 * layer.mW[j][i] + (1 - beta1) * gW;
          layer.vW[j][i] = beta2 * layer.vW[j][i] + (1 - beta2) * (gW * gW);

          const mWHat = layer.mW[j][i] / (1 - Math.pow(beta1, this.adamT));
          const vWHat = layer.vW[j][i] / (1 - Math.pow(beta2, this.adamT));
          layer.W[j][i] -= (lr / (Math.sqrt(vWHat) + eps)) * mWHat;
        }
      }
    }

    this.epoch += 1;

    // Calcular métricas periódicamente
    this.computeMetrics(trainData, testData);
  }

  /**
   * Extrae el vector de entrada con las características activas
   */
  extractFeatures(sample) {
    const x1 = sample.x1;
    const x2 = sample.x2;

    // Dependiendo de this.inputFeatures (o por defecto x1, x2)
    if (!this.featuresEnabled) {
      return [x1, x2];
    }

    const feats = [];
    if (this.featuresEnabled.x1) feats.push(x1);
    if (this.featuresEnabled.x2) feats.push(x2);
    if (this.featuresEnabled.x1_sq) feats.push(x1 * x1);
    if (this.featuresEnabled.x2_sq) feats.push(x2 * x2);
    if (this.featuresEnabled.x1_x2) feats.push(x1 * x2);
    if (this.featuresEnabled.sin_x1) feats.push(Math.sin(x1 * Math.PI));
    if (this.featuresEnabled.sin_x2) feats.push(Math.sin(x2 * Math.PI));

    return feats.length > 0 ? feats : [x1, x2];
  }

  setFeatureConfig(enabledFeatures) {
    this.featuresEnabled = enabledFeatures;
    let count = 0;
    for (const k in enabledFeatures) {
      if (enabledFeatures[k]) count++;
    }
    this.inputSize = Math.max(1, count);
    this.initWeights();
  }

  /**
   * Calcula Loss y Accuracy en conjuntos de Train y Test
   */
  computeMetrics(trainData, testData) {
    // Métricas en test
    if (testData && testData.length > 0) {
      let tLoss = 0;
      let tCorrect = 0;
      for (const sample of testData) {
        const target = sample.label !== undefined ? sample.label : sample.targetValue;
        const out = this.forward(this.extractFeatures(sample));
        if (this.problemType === 'classification') {
          const p = Math.max(1e-7, Math.min(1 - 1e-7, out));
          tLoss += -(target * Math.log(p) + (1 - target) * Math.log(1 - p));
          const pred = out >= 0.5 ? 1 : 0;
          if (pred === target) tCorrect++;
        } else {
          tLoss += Math.pow(out - target, 2);
        }
      }
      this.testLoss = Number((tLoss / testData.length).toFixed(4));
      this.testAccuracy = Number(((tCorrect / testData.length) * 100).toFixed(1));
    }

    // Métricas en train
    if (trainData && trainData.length > 0) {
      let trLoss = 0;
      let trCorrect = 0;
      // Evaluar sobre una muestra representativa para rendimiento
      const sampleSize = Math.min(60, trainData.length);
      for (let i = 0; i < sampleSize; i++) {
        const sample = trainData[i];
        const target = sample.label !== undefined ? sample.label : sample.targetValue;
        const out = this.forward(this.extractFeatures(sample));
        if (this.problemType === 'classification') {
          const p = Math.max(1e-7, Math.min(1 - 1e-7, out));
          trLoss += -(target * Math.log(p) + (1 - target) * Math.log(1 - p));
          const pred = out >= 0.5 ? 1 : 0;
          if (pred === target) trCorrect++;
        } else {
          trLoss += Math.pow(out - target, 2);
        }
      }
      this.trainLoss = Number((trLoss / sampleSize).toFixed(4));
      this.trainAccuracy = Number(((trCorrect / sampleSize) * 100).toFixed(1));
    }

    // Guardar historial para gráfica
    this.lossHistory.push({
      epoch: this.epoch,
      trainLoss: this.trainLoss,
      testLoss: this.testLoss,
      trainAcc: this.trainAccuracy,
      testAcc: this.testAccuracy
    });

    if (this.lossHistory.length > 150) {
      this.lossHistory.shift();
    }
  }
}
