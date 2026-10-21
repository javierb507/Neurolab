/**
 * Funciones de activación y sus derivadas para la red neuronal
 */

export const Activations = {
  relu: {
    name: 'ReLU',
    formula: 'max(0, z)',
    desc: 'Rectified Linear Unit. Rápida y previene el desvanecimiento de gradiente, ideal para capas ocultas.',
    fn: (z) => Math.max(0, z),
    deriv: (z) => (z > 0 ? 1 : 0)
  },
  leakyRelu: {
    name: 'Leaky ReLU',
    formula: 'z > 0 ? z : 0.01z',
    desc: 'Evita el problema de neuronas muertas permitiendo un pequeño gradiente cuando z < 0.',
    fn: (z) => (z > 0 ? z : 0.01 * z),
    deriv: (z) => (z > 0 ? 1 : 0.01)
  },
  tanh: {
    name: 'Tanh',
    formula: '(e^z - e^-z)/(e^z + e^-z)',
    desc: 'Tangente hiperbólica. Salida centrada en cero [-1, 1], buena para datos normalizados.',
    fn: (z) => {
      if (z > 20) return 1;
      if (z < -20) return -1;
      const e1 = Math.exp(z);
      const e2 = Math.exp(-z);
      return (e1 - e2) / (e1 + e2);
    },
    deriv: (z) => {
      const t = Activations.tanh.fn(z);
      return 1 - t * t;
    }
  },
  sigmoid: {
    name: 'Sigmoide',
    formula: '1 / (1 + e^-z)',
    desc: 'Comprime valores entre [0, 1]. Ideal para probabilidades e interpretaciones binarias.',
    fn: (z) => {
      if (z < -45) return 0;
      if (z > 45) return 1;
      return 1 / (1 + Math.exp(-z));
    },
    deriv: (z) => {
      const s = Activations.sigmoid.fn(z);
      return s * (1 - s);
    }
  },
  linear: {
    name: 'Lineal',
    formula: 'z',
    desc: 'Función identidad. Se utiliza típicamente en problemas de regresión en la capa de salida.',
    fn: (z) => z,
    deriv: () => 1
  }
};
