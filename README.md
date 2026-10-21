# 🧠 NeuroLab: Interactive Neural Network Playground & Deep Learning Studio

<div align="center">

[![Release](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/javierb507/Neurolab/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20ES-cyan.svg)](#-internationalization-i18n)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vitejs.dev/)

**Interactive, didactic, and story-driven deep learning exploration powered by real-world problems.**

🌐 **[Leer en Español (README.es.md)](./README.es.md)** | 📚 **[Pedagogical Teacher Guide (TEACHER_GUIDE.md)](./TEACHER_GUIDE.md)** | 🎓 **[Guía del Profesor en Español (GUIA_PROFESOR.md)](./GUIA_PROFESOR.md)**

</div>

---

## 🌟 Overview

Inspired by the iconic **TensorFlow Playground**, **NeuroLab** redesigns the learning experience from the ground up:
- Instead of abstract mathematical coordinates ($x_1, x_2$), all datasets represent **tangible real-world problems** (clinical diabetes diagnosis, bank card fraud detection, autonomous vehicle emergency braking, industrial laser quality control, real estate valuation).
- Expands beyond basic Multilayer Perceptrons (MLP) into full visual studios for **Convolutional Neural Networks (CNN)**, **Recurrent Neural Networks (RNN)**, and modern **Large Language Models (LLMs / Transformers)**.
- Features an interactive **Neuron Microscope**, **Custom Probe** testing in physical units, **Self-Attention arc visualizer**, **Subword Tokenizer**, and guided **Academy Missions**.
- Engineered with **Vanilla JavaScript (ES6 modules)** and HTML5 Canvas / dynamic SVG — **zero heavy runtime dependencies**, running butter-smooth at 60 FPS in the browser.

---

## ✨ Key Features & Interactive Studios

### 1. 🏥 Real-World, Story-Driven Problems
Connect neural decision surfaces with domain science and physical laws:
- **Medical Diagnostics (Type 2 Diabetes)**: Predict diabetic risk based on fasting plasma glucose ($mg/dL$) and Body Mass Index ($BMI$, $kg/m^2$). Calibrated from the National Institute of Diabetes / Kaggle Pima Indians benchmark. Learn why elevated BMI amplifies insulin resistance non-linearly.
- **Financial Cybersecurity (Card Fraud Detection)**: Detect fraudulent transactions based on transaction amount ($€$) and geographical distance from home ($km$). Inspired by the ULB Credit Card benchmark. Teaches circular anomaly detection and concentric decision boundaries.
- **Autonomous Vehicles (Emergency Braking)**: Make millisecond stopping decisions using obstacle distance ($m$) and velocity ($km/h$). Visualizes how the network discovers the quadratic kinematic braking formula ($d \propto v^2$).
- **Industry 4.0 (Optical Quality Control)**: Classify manufactured components via dimensional tolerance ($\mu m$) and material density ($\%$). Represents a non-linear, multimodal XOR defect envelope.
- **Real Estate Valuation (Continuous Regression)**: Predict continuous property prices based on living square meters and urban connectivity score.

---

### 2. 🔬 Interactive Neuron Microscope
Click on any neuron in the synaptic graph to open the **Neuron Microscope modal**. In real time, it breaks down:
- Every incoming activation value ($a_i$).
- The corresponding synaptic weight ($w_i$) and weighted product ($w_i \cdot a_i$).
- The neuron's learnable bias ($b$).
- The net pre-activation linear combination:
  $$z = \sum_{i=1}^n (w_i \cdot a_i) + b$$
- The non-linear activation function:
  $$a = f(z)$$
- A human-friendly explanation of why the neuron is actively firing or inhibited for the current training sample.

---

### 3. 🎯 Continuous Decision Boundary & Custom Probe
- **60 FPS Real-Time Heatmap**: A continuous 2D color-gradient probability surface that updates dynamically as backpropagation updates weights.
- **Train vs. Test Split Visualization**: Solid dots represent training points; distinct concentric rings show unseen test data for measuring true generalization.
- **Custom Probe Tool**: Click anywhere on the feature plane to insert a custom synthetic subject (e.g. a patient with $140\text{ mg/dL}$ glucose and $32\text{ BMI}$) and immediately inspect the model's output confidence and classification.

---

### 4. 👁️ Computer Vision Studio (CNN)
- Understand why flat dense layers fail on 2D imagery due to loss of spatial coherence.
- **Interactive 3x3 Convolution Kernels**: Toggle between Sobel X (vertical edges), Sobel Y (horizontal edges), Sharpen, and Laplacian filters.
- **Animated Sliding Receptive Field**: Move a 3x3 window across medical lung/bone scans to watch the element-wise kernel dot product accumulate step-by-step.
- **Feature Map & 2x2 Max Pooling**: Observe how spatial resolution is halved while retaining invariant dominant features.

---

### 5. ⏳ Temporal Sequences & Memory Studio (RNN)
- Demystify recurrent loops and hidden state vectors for time-series and NLP.
- **Clinical Sequence Analysis**: Step token-by-token through medical statements such as:
  > *"Patient presents fever and acute pain but comprehensive lab analysis ruled out infection."*
- **Hidden State ($h_t$) Gauge**: Watch the internal memory vector register growing alarm on *"fever"* and *"pain"*, and watch how the critical negation token *"ruled out"* instantly suppresses prior symptoms.
- **Architectural Comparison**: Live comparison matrix evaluating MLP vs. RNN vs. Transformer Self-Attention.

---

### 6. 💬 Tokens & Language Models Studio (LLM / Transformers)
- **Live Byte-Pair Encoding (BPE)**: Watch input text break into tokens, leading space indicators (`·`), and integer vocabulary IDs.
- **Curved SVG Self-Attention Arcs**: Hover over any token to inspect attention weights and discover how context resolves polysemy (e.g., *bank* in *"sat on the bank of the river"* vs. *"opened a savings bank account"*).
- **Softmax Next-Token Probability Distribution**: Explore the top predicted candidate tokens with real-time probability bars.
- **Autoregressive Generation**: Click *"Predict Next Token"* or *"Auto-Generate"* to watch the transformer generate sentences word-by-word.

---

### 7. 🎓 NeuroLab Academy & Guided Missions
Four one-click didactic experiments designed to dismantle misconceptions:
1. **The Linear Trap (Perceptron Barrier)**: See why 0 hidden layers cannot separate concentric circles (Minsky & Papert XOR theorem).
2. **The Power of Non-Linearity & ReLU**: Add hidden layers and observe how the network folds decision space.
3. **The Overfitting Monster**: Train on noisy data with excessive neurons; observe chaotic decision boundaries, and use L2 regularization to restore smooth generalization.
4. **The Physics of Autonomous Vehicles**: Tune hyperparameters and feature terms ($X_2^2$) to fit the kinematic quadratic curve.
- **Visual Glossary**: Real-world analogies for Backpropagation, Gradient Descent, Learning Rate, Bias, Weights, and Epochs.

---

## 🌐 Internationalization (i18n)

NeuroLab includes an instant, client-side bilingual engine:
- Switch seamlessly between **English** and **Spanish** using the header globe toggle.
- Preferences automatically persist in `localStorage`.
- All controls, datasets, physical units, microscope formulas, and pedagogical explanations are translated without reloading the page.

---

## 📚 Teacher & Educational Guide

A complete classroom syllabus and curriculum guide is included in the repository:
- **English**: [📖 `TEACHER_GUIDE.md`](./TEACHER_GUIDE.md)
- **Spanish**: [🎓 `GUIA_PROFESOR.md`](./GUIA_PROFESOR.md)

### What the Teacher Guide covers:
- Scientific sources and justification for each dataset (Kaggle Pima, ULB Credit Card Fraud, physics kinematics, Ames housing).
- Activation function selection rules (when and why to use ReLU, Tanh, Sigmoid, or Leaky ReLU).
- Noise theory: why sensor noise is introduced and how to use it to demonstrate overfitting in class.
- How to teach Tokenization, Self-Attention, and LLM text generation step-by-step.
- Recommended 60-90 minute interactive lecture timetable with teacher script.
- Answers to common student questions and conceptual stumbling blocks.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/javierb507/Neurolab.git
cd Neurolab

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser at:
`http://localhost:5173/`

### Production Build

```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```
Redes_neuronales/
├── index.html                 # Main single-page application structure & modals
├── package.json               # Metadata & dependencies (v1.0.0)
├── README.md                  # International documentation (English default)
├── README.es.md               # Documentación en Español
├── TEACHER_GUIDE.md           # Pedagogical guide for teachers (English)
├── GUIA_PROFESOR.md           # Manual didáctico del profesor (Español)
├── LICENSE                    # MIT License
├── public/                    # Static assets
└── src/
    ├── main.js                # App bootstrap & event coordination
    ├── style.css              # Dark glassmorphism UI & responsive styles
    ├── components/
    │   ├── cnnVisualizer.js   # 3x3 convolution, sliding kernel & max-pooling
    │   ├── rnnVisualizer.js   # Sequential token analysis & hidden state gauge
    │   ├── llmVisualizer.js   # BPE tokenizer, SVG attention arcs & generation
    │   └── academy.js         # Guided challenges & visual glossary
    ├── i18n/
    │   ├── index.js           # Localization manager & DOM translation engine
    │   └── translations.js    # Bilingual translation dictionaries (ES / EN)
    ├── nn/
    │   ├── activations.js     # ReLU, Sigmoid, Tanh, LeakyReLU, Linear + derivatives
    │   ├── dataset.js         # Story-driven synthetic generators & physical units
    │   ├── network.js         # Neural network model, Adam optimizer & backprop
    │   └── visualizer.js      # Synaptic graph rendering & 60 FPS decision heatmap
    └── utils/
        └── audio.js           # Web Audio API procedural sound synthesizer
```

---

## 🛠️ Technical Stack
- **HTML5 Canvas & Dynamic SVG**: Vector rendering of network graphs, curved self-attention arcs, and probability surfaces.
- **Vanilla ES6 JavaScript**: Custom neural computation engine with vectorized forward and backward passes, Adam optimizer, and L1/L2 regularization. No bulky frameworks.
- **Web Audio API**: Real-time auditory synthesis providing subtle acoustic feedback during training iterations and token generation.
- **CSS3 Dark Glassmorphism**: Neon-accented color palette, backdrop blur filters, and typography powered by *Plus Jakarta Sans* and *JetBrains Mono*.
- **Vite**: Ultra-fast hot module replacement (HMR) and optimized static bundling.

---

## 📄 License
This project is open-source under the [MIT License](./LICENSE).

---

<div align="center">
Built with passion for accessible, visual, and scientifically grounded Artificial Intelligence education.
</div>
