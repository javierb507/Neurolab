/**
 * Diccionario Internacional de Traducciones (i18n)
 * Soporta Español (es) e Inglés (en) para toda la aplicación NeuroLab.
 */

export const TRANSLATIONS = {
  es: {
    brand: {
      title: 'NeuroLab',
      subtitle: 'Playground de Inteligencia Artificial & Casos Reales'
    },
    nav: {
      mlp: 'Playground MLP',
      cnn: 'Visión CNN',
      rnn: 'Secuencias RNN',
      llm: 'Tokens & LLM',
      academy: 'Academia & Retos',
      langToggleTitle: 'Switch Language to English / Cambiar a Inglés'
    },
    header: {
      soundToggle: 'Activar/Silenciar sonido de simulación',
      quickGuide: '¿Cómo empezar?',
      quickGuideTitle: 'Guía rápida para principiantes'
    },
    controls: {
      train: 'Entrenar',
      pause: 'Pausar',
      trainTitle: 'Iniciar / Pausar entrenamiento continuo',
      step: 'Paso a Paso',
      stepTitle: 'Ejecutar exactamente 1 época paso a paso',
      resetTitle: 'Reiniciar pesos de la red a valores aleatorios',
      epoch: 'Época:',
      lrLabel: 'Learning Rate (α):',
      actLabel: 'Activación:',
      regLabel: 'Regularización:',
      regRateLabel: 'Fuerza Reg (λ):',
      lrOptions: {
        '0.001': '0.001 (Lento y seguro)',
        '0.01': '0.01 (Moderado)',
        '0.03': '0.03 (Recomendado)',
        '0.08': '0.08 (Rápido)',
        '0.2': '0.20 (Agresivo)',
        '0.8': '0.80 (Inestable)'
      },
      actOptions: {
        relu: 'ReLU (Estándar)',
        leakyRelu: 'Leaky ReLU (Anti-muerte)',
        tanh: 'Tanh (Simétrica)',
        sigmoid: 'Sigmoide (Probabilística)',
        linear: 'Lineal (Sin curvatura)'
      },
      regOptions: {
        none: 'Ninguna',
        l2: 'L2 (Ridge - Suaviza pesos)',
        l1: 'L1 (Lasso - Pesos cero)'
      }
    },
    dataPanel: {
      title: 'Problema del Mundo Real',
      noiseLabel: 'Ruido en las mediciones:',
      ratioLabel: 'Reparto Entrenamiento / Test:',
      batchLabel: 'Tamaño del Lote (Batch):',
      batchAll: 'Todos',
      regenerateBtn: 'Regenerar Datos del Caso',
      featEngTitle: 'Ingeniería de Características',
      featEngSub: 'Selecciona qué transformaciones matemáticas de X₁ y X₂ recibe la red:'
    },
    networkVis: {
      title: 'Arquitectura Sináptica en Vivo',
      hiddenLayersLabel: 'Capas Ocultas:',
      layersBadge: '{n} capas',
      removeLayerTitle: 'Quitar capa oculta',
      addLayerTitle: 'Añadir capa oculta',
      inputLayer: 'Entrada (Features)',
      outputLayer: 'Salida',
      hiddenLayer: 'Oculta {n}',
      legendPos: 'Peso positivo (+)',
      legendNeg: 'Peso negativo (-)',
      legendActive: 'Alta activación',
      legendInspect: 'Haz clic en una neurona para inspeccionar'
    },
    boundary: {
      title: 'Frontera de Decisión en Vivo',
      testDataToggle: 'Datos Test',
      testDataTitle: 'Mostrar/ocultar puntos de evaluación (test)',
      discretizeToggle: 'Discretizar',
      discretizeTitle: 'Ver frontera nítida al 50% de probabilidad',
      trainLoss: 'Loss Entrenamiento:',
      testLoss: 'Loss Test:',
      testAcc: 'Precisión (Test Acc):',
      axisX: '{name} (Eje horizontal X₁)',
      axisY: '{name} (Eje vertical X₂)',
      probeTitle: 'Sonda de Prueba Personalizada',
      probeClickHint: 'Haz clic en cualquier punto para evaluar un caso personalizado',
      predictionLabel: 'Predicción:'
    },
    lossChart: {
      title: 'Curva de Convergencia (Loss)',
      trainLoss: 'Train Loss',
      testLoss: 'Test Loss'
    },
    microscope: {
      title: 'Microscopio Neuronal',
      inputTitle: 'Neurona de Entrada: {name}',
      inputBadge: 'Capa de Entrada (Input Layer)',
      inputDesc: 'Esta neurona no tiene pesos previos; recibe directamente la señal del mundo exterior normalizada en el rango [-1, 1].',
      normReceived: 'Valor Normalizado Recibido:',
      normWhy: '¿Por qué normalizar?',
      normExplanation: 'Las redes aprenden mucho más rápido cuando las variables (como {name} en {unit}) se escalan alrededor de cero, evitando que una variable de magnitud grande opaque a las demás.',
      outputTitle: 'Neurona de Salida (ŷ)',
      hiddenTitle: 'Neurona #{index} en Capa Oculta {layer}',
      outputBadge: 'Capa de Salida (Predicción Final)',
      hiddenBadge: 'Capa Oculta {layer} | Activación: {act}',
      thInput: 'Entrada',
      thVal: 'Valor (aᵢ)',
      thWeight: 'Peso (wᵢ)',
      thSubtotal: 'Subtotal',
      biasLabel: '+ Sesgo (Bias b):',
      zTotal: 'Suma Neta Lineal (z):',
      actFinal: 'Activación Final a = {act}(z):',
      inhibited: 'Inhibida (0.000)',
      active: 'Activa'
    },
    quickGuide: {
      title: 'Guía Rápida: Cómo sacar el máximo partido a NeuroLab',
      step1Title: 'Elige un Problema Real:',
      step1Desc: 'Selecciona a la izquierda si deseas diagnosticar diabetes, detectar fraudes bancarios o controlar el frenado de un coche autónomo. Cada problema tiene variables con significado médico o financiero real.',
      step2Title: 'Diseña la Red Neuronal:',
      step2Desc: 'Usa los botones [+] y [-] en la columna central para añadir capas ocultas o neuronas. Mira cómo las líneas (sinapsis) cambian de grosor según su peso numérico.',
      step3Title: 'Dale al botón \'Entrenar\' o \'Paso a Paso\':',
      step3Desc: 'Observa cómo la frontera de decisión a la derecha se curva en tiempo real adaptándose a los datos. Si quieres ver exactamente qué calcula una neurona en cualquier instante, ¡haz clic sobre ella para abrir el Microscopio Neuronal!',
      step4Title: 'Explora los otros tipos de redes:',
      step4Desc: 'Usa la barra superior para explorar cómo una Red Convolucional (CNN) detecta bordes en imágenes médicas, cómo una Red Recurrente (RNN) analiza texto palabra por palabra y cómo un LLM predice el siguiente token.',
      gotItBtn: '¡Entendido, vamos a experimentar!'
    },
    cnn: {
      badge: 'Visión por Computadora',
      title: '¿Cómo ve el mundo una Red Neuronal Convolucional (CNN)?',
      desc: 'A diferencia de las redes densas (MLP) que tratan cada píxel como un número aislado perdiendo la noción de espacio, las CNN usan pequeños filtros deslizantes llamados Kernels para escanear la imagen y extraer bordes, curvas y texturas, sin importar dónde aparezcan.',
      selectFilter: 'Seleccionar Filtro (Kernel 3×3):',
      autoScan: 'Auto-Escanear',
      pauseScan: 'Pausar',
      resetPos: 'Reiniciar Posición',
      stage1Title: 'Imagen de Entrada',
      stage1Sub: '8×8 Píxeles (Escala de Grises)',
      stage1Legend: 'Muestra una radiografía simulada con un nódulo central.',
      stage2Title: 'Mapa de Características',
      stage2Sub: '6×6 Convolución + ReLU',
      stage2Legend: 'Resalta las zonas donde el filtro coincide con la imagen.',
      stage3Title: 'Reducción Max Pooling',
      stage3Sub: '3×3 Muestreo de Máximos',
      stage3Legend: 'Conserva el rasgo más intenso reduciendo el tamaño a la mitad.',
      mathTitle: 'Cálculo del Píxel Activo en el Receptive Field:',
      mathSum: 'Suma de productos punto:',
      reluApplied: 'ReLU aplicado: max(0, {val}) = {out}',
      kernels: {
        sobelX: {
          name: 'Bordes Verticales (Sobel X)',
          desc: 'Detecta transiciones bruscas de luz de izquierda a derecha (bordes verticales de fracturas o piezas).'
        },
        sobelY: {
          name: 'Bordes Horizontales (Sobel Y)',
          desc: 'Detecta transiciones bruscas de luz de arriba a abajo (superficies horizontales).'
        },
        sharpen: {
          name: 'Realce de Detalles (Sharpen)',
          desc: 'Acentúa el contraste de los centros respecto a su entorno para aislar micro-defectos.'
        },
        outline: {
          name: 'Detector Laplaciano (Contornos)',
          desc: 'Filtro omnidireccional que aísla el contorno completo de cualquier objeto.'
        }
      }
    },
    rnn: {
      badge: 'Memoria y Secuencias Temporales',
      title: 'Redes Recurrentes (RNN) vs. Transformers',
      desc: 'Una red densa (MLP) no tiene noción del orden ni del tiempo: procesa cada dato como un evento aislado. Las Redes Recurrentes (RNN) tienen un bucle de retroalimentación interna llamado Estado Oculto (Hidden State hₜ) que transporta la memoria del pasado hacia el futuro.',
      playSeq: 'Reproducir Secuencia',
      pauseSeq: 'Pausar',
      prevBtn: 'Anterior',
      nextBtn: 'Siguiente',
      resetBtn: 'Reiniciar',
      stepLabel: 'Paso:',
      tagInput: 'Palabra Entrada (xₜ)',
      tagCell: 'Célula Recurrente (RNN Cell)',
      tagOutput: 'Predicción en tiempo t (ŷₜ)',
      alarmLabel: 'Nivel de Alarma en Memoria (hₜ):',
      insightTitle: '¿Qué ocurre en este instante?',
      stableEval: 'Evaluación Estable',
      alertEval: '⚠️ ALERTA MÉDICA',
      lowRiskEval: 'Bajo Riesgo / Infección Descartada',
      tokens: [
        { word: 'Paciente', desc: 'Sujeto neutro inicial' },
        { word: 'presenta', desc: 'Verbo de observación clínica' },
        { word: 'fiebre', desc: 'Síntoma: Estado oculto sube a nivel de ALERTA' },
        { word: 'y dolor', desc: 'Agravamiento: Memoria interna acumula alta preocupación' },
        { word: 'pero', desc: 'Conjunción adversativa: Cambia el rumbo semántico' },
        { word: 'el análisis', desc: 'Entrada de evidencia diagnóstica' },
        { word: 'descartó', desc: 'Negación clave: Neutraliza los síntomas anteriores' },
        { word: 'infección.', desc: 'Conclusión: La memoria clasifica como "Bajo Riesgo"' }
      ],
      compCards: [
        {
          title: 'Perceptrón Multicapa (MLP)',
          tag: 'Sin Memoria',
          desc: 'Lee todas las palabras a la vez o de forma aislada. No sabe si "descartó" vino antes o después de "infección".'
        },
        {
          title: 'Red Recurrente (RNN / LSTM)',
          tag: 'Memoria Secuencial',
          desc: 'Lee palabra por palabra paso a paso. Problema: En frases muy largas, los primeros recuerdos tienden a olvidarse (Vanishing Gradient).'
        },
        {
          title: 'Transformer (Atención)',
          tag: 'Auto-Atención Directa',
          desc: 'La arquitectura de ChatGPT: conecta todas las palabras entre sí simultáneamente sin necesidad de procesar una por una, permitiendo comprender contextos gigantescos.'
        }
      ]
    },
    llm: {
      badge: 'Procesamiento del Lenguaje Natural (NLP)',
      title: '¿Cómo Funciona un LLM por Dentro? De Texto a Probabilidades',
      desc: 'Los modelos como ChatGPT o Gemini no leen palabras como los humanos ni buscan respuestas pregrabadas. A continuación puedes ver la animación en vivo de los 3 pasos fundamentales: Tokenización (troceado numérico), Auto-Atención (comprensión contextual) y Predicción Autorregresiva (adivinar la siguiente pieza).',
      examplesLabel: 'Ejemplos Guiados:',
      customPlaceholder: 'Escribe cualquier frase aquí para ver cómo se tokeniza...',
      resetPhrase: 'Reiniciar Frase',
      stage1Badge: 'Paso 1',
      stage1Title: 'Tokenización y Asignación de IDs (BPE)',
      stage1Sub: 'La frase se divide en subpalabras y cada una recibe un código numérico del diccionario (Vocabulario).',
      totalTokens: 'Total: {n} tokens',
      note: 'Nota los colores y el símbolo _: los espacios iniciales también son parte del token. Las palabras compuestas o conjugadas se dividen en prefijos y sufijos para ahorrar memoria.',
      stage2Badge: 'Paso 2',
      stage2Title: 'Mecanismo de Auto-Atención (Self-Attention)',
      stage2Sub: 'Pasa el cursor sobre cualquier palabra para ver cómo el Transformer conecta unas palabras con otras para deducir el contexto exacto.',
      hoverHint: 'Haz hover en un token',
      explInitial: 'Pasa el ratón sobre un token para ver qué palabras le dan su significado contextual.',
      stage3Badge: 'Paso 3',
      stage3Title: 'Predicción de la Siguiente Palabra (Softmax)',
      stage3Sub: 'El LLM calcula qué token tiene mayor probabilidad matemática de continuar la historia.',
      predictNextBtn: 'Predecir Siguiente Token',
      autoGenBtn: 'Auto-Generar',
      pauseGenBtn: 'Pausar',
      probColTitle: 'Distribución de Probabilidades para el Próximo Token:',
      loopColTitle: 'El Bucle Autorregresivo:',
      loopStep1: 'Elige el token más probable (o por muestreo)',
      loopStep2: 'Lo añade al final del texto',
      loopStep3: 'Vuelve al Paso 1 con la nueva frase ampliada',
      presets: {
        gato: {
          title: 'El gato curioso',
          initialText: 'El gato bebió'
        },
        bancoParque: {
          title: 'El significado de "Banco" (Contexto Parque)',
          initialText: 'El banco del parque estaba'
        },
        bancoDinero: {
          title: 'El significado de "Banco" (Contexto Financiero)',
          initialText: 'Fui al banco a pedir un'
        }
      }
    },
    academy: {
      badge: 'Retos Interactivos Guiados',
      title: 'Aprende Deep Learning Experimentando',
      desc: 'Supera estos retos interactivos diseñados para comprender de forma intuitiva los conceptos más importantes: desde la limitación del perceptrón simple hasta el sobreajuste y la regularización.',
      glossaryTitle: 'Glosario Visual de Conceptos Clave',
      missionsTitle: 'Misiones Prácticas de Entrenamiento'
    }
  },

  en: {
    brand: {
      title: 'NeuroLab',
      subtitle: 'Artificial Intelligence Playground with Real-World Cases'
    },
    nav: {
      mlp: 'MLP Playground',
      cnn: 'CNN Vision',
      rnn: 'RNN Sequences',
      llm: 'Tokens & LLM',
      academy: 'Academy & Challenges',
      langToggleTitle: 'Cambiar a Español / Switch to Spanish'
    },
    header: {
      soundToggle: 'Enable / Mute simulation sound',
      quickGuide: 'How to start?',
      quickGuideTitle: 'Quick beginner guide'
    },
    controls: {
      train: 'Train',
      pause: 'Pause',
      trainTitle: 'Start / Pause continuous neural network training',
      step: 'Step by Step',
      stepTitle: 'Run exactly 1 epoch step-by-step',
      resetTitle: 'Reset network weights to random values',
      epoch: 'Epoch:',
      lrLabel: 'Learning Rate (α):',
      actLabel: 'Activation:',
      regLabel: 'Regularization:',
      regRateLabel: 'Reg Rate (λ):',
      lrOptions: {
        '0.001': '0.001 (Slow & safe)',
        '0.01': '0.01 (Moderate)',
        '0.03': '0.03 (Recommended)',
        '0.08': '0.08 (Fast)',
        '0.2': '0.20 (Aggressive)',
        '0.8': '0.80 (Unstable)'
      },
      actOptions: {
        relu: 'ReLU (Standard)',
        leakyRelu: 'Leaky ReLU (Anti-dying)',
        tanh: 'Tanh (Symmetric)',
        sigmoid: 'Sigmoid (Probabilistic)',
        linear: 'Linear (No curvature)'
      },
      regOptions: {
        none: 'None',
        l2: 'L2 (Ridge - Smooth weights)',
        l1: 'L1 (Lasso - Sparse weights)'
      }
    },
    dataPanel: {
      title: 'Real-World Problem',
      noiseLabel: 'Measurement noise:',
      ratioLabel: 'Train / Test Split Ratio:',
      batchLabel: 'Batch Size:',
      batchAll: 'All',
      regenerateBtn: 'Regenerate Case Data',
      featEngTitle: 'Feature Engineering',
      featEngSub: 'Select which mathematical transformations of X₁ and X₂ feed the network:'
    },
    networkVis: {
      title: 'Live Synaptic Architecture',
      hiddenLayersLabel: 'Hidden Layers:',
      layersBadge: '{n} layers',
      removeLayerTitle: 'Remove hidden layer',
      addLayerTitle: 'Add hidden layer',
      inputLayer: 'Input (Features)',
      outputLayer: 'Output',
      hiddenLayer: 'Hidden {n}',
      legendPos: 'Positive weight (+)',
      legendNeg: 'Negative weight (-)',
      legendActive: 'High activation',
      legendInspect: 'Click any neuron to inspect'
    },
    boundary: {
      title: 'Live Decision Boundary',
      testDataToggle: 'Test Data',
      testDataTitle: 'Show/hide evaluation test points',
      discretizeToggle: 'Discretize',
      discretizeTitle: 'Show sharp 50% probability boundary',
      trainLoss: 'Train Loss:',
      testLoss: 'Test Loss:',
      testAcc: 'Accuracy (Test Acc):',
      axisX: '{name} (Horizontal Axis X₁)',
      axisY: '{name} (Vertical Axis X₂)',
      probeTitle: 'Custom Test Probe',
      probeClickHint: 'Click anywhere on the map to evaluate a custom case',
      predictionLabel: 'Prediction:'
    },
    lossChart: {
      title: 'Convergence Curve (Loss)',
      trainLoss: 'Train Loss',
      testLoss: 'Test Loss'
    },
    microscope: {
      title: 'Neuron Microscope',
      inputTitle: 'Input Neuron: {name}',
      inputBadge: 'Input Layer',
      inputDesc: 'This neuron has no incoming weights; it directly receives normalized signals [-1, 1] from the real world.',
      normReceived: 'Normalized Value Received:',
      normWhy: 'Why normalize inputs?',
      normExplanation: 'Neural networks learn significantly faster when input features (like {name} in {unit}) are centered around zero, preventing large scale variables from dominating the rest.',
      outputTitle: 'Output Neuron (ŷ)',
      hiddenTitle: 'Neuron #{index} in Hidden Layer {layer}',
      outputBadge: 'Output Layer (Final Prediction)',
      hiddenBadge: 'Hidden Layer {layer} | Activation: {act}',
      thInput: 'Input',
      thVal: 'Value (aᵢ)',
      thWeight: 'Weight (wᵢ)',
      thSubtotal: 'Subtotal',
      biasLabel: '+ Bias (b):',
      zTotal: 'Net Linear Sum (z):',
      actFinal: 'Final Activation a = {act}(z):',
      inhibited: 'Inhibited (0.000)',
      active: 'Active'
    },
    quickGuide: {
      title: 'Quick Guide: How to get the most out of NeuroLab',
      step1Title: 'Choose a Real-World Problem:',
      step1Desc: 'Select on the left whether you want to diagnose diabetes, detect credit card fraud, or control emergency braking for autonomous cars. Each scenario uses clinical or financial domain variables.',
      step2Title: 'Design your Neural Network:',
      step2Desc: 'Use the [+] and [-] buttons in the center column to add hidden layers or neurons. Notice how lines (synapses) change thickness based on their weight magnitude.',
      step3Title: 'Click \'Train\' or \'Step by Step\':',
      step3Desc: 'Watch the decision boundary on the right curve in real-time to fit the data. If you want to inspect the exact math of any neuron at any moment, click on it to open the Neuron Microscope!',
      step4Title: 'Explore Other Architectures:',
      step4Desc: 'Use the top tabs to explore how a Convolutional Network (CNN) detects edges in medical imaging, how a Recurrent Network (RNN) analyzes sequential text, and how an LLM predicts the next token.',
      gotItBtn: 'Got it, let\'s experiment!'
    },
    cnn: {
      badge: 'Computer Vision',
      title: 'How does a Convolutional Neural Network (CNN) see?',
      desc: 'Unlike dense networks (MLP) which treat each pixel as an isolated number losing spatial coherence, CNNs use small sliding filters called Kernels to scan the image and extract edges, curves, and textures regardless of position.',
      selectFilter: 'Select Filter (Kernel 3×3):',
      autoScan: 'Auto-Scan',
      pauseScan: 'Pause',
      resetPos: 'Reset Position',
      stage1Title: 'Input Image',
      stage1Sub: '8×8 Pixels (Grayscale)',
      stage1Legend: 'Shows a simulated X-ray scan with a central nodule.',
      stage2Title: 'Feature Map',
      stage2Sub: '6×6 Convolution + ReLU',
      stage2Legend: 'Highlights areas where the filter matches image features.',
      stage3Title: 'Max Pooling Downsampling',
      stage3Sub: '3×3 Maximum Sampling',
      stage3Legend: 'Preserves the strongest feature while halving spatial dimensions.',
      mathTitle: 'Active Pixel Calculation in Receptive Field:',
      mathSum: 'Dot product sum:',
      reluApplied: 'ReLU applied: max(0, {val}) = {out}',
      kernels: {
        sobelX: {
          name: 'Vertical Edges (Sobel X)',
          desc: 'Detects sharp light transitions from left to right (vertical borders of fractures or parts).'
        },
        sobelY: {
          name: 'Horizontal Edges (Sobel Y)',
          desc: 'Detects sharp light transitions from top to bottom (horizontal surfaces).'
        },
        sharpen: {
          name: 'Detail Enhancement (Sharpen)',
          desc: 'Accentuates center contrast relative to surroundings to isolate micro-defects.'
        },
        outline: {
          name: 'Laplacian Detector (Contours)',
          desc: 'Omnidirectional edge detector isolating complete boundaries of any object.'
        }
      }
    },
    rnn: {
      badge: 'Memory & Time Sequences',
      title: 'Recurrent Neural Networks (RNN) vs. Transformers',
      desc: 'A dense network (MLP) has no sense of order or time: it treats each token as an isolated event. Recurrent Networks (RNN) feature an internal feedback loop called Hidden State (hₜ) that carries past memories into the future.',
      playSeq: 'Play Sequence',
      pauseSeq: 'Pause',
      prevBtn: 'Previous',
      nextBtn: 'Next',
      resetBtn: 'Reset',
      stepLabel: 'Step:',
      tagInput: 'Input Word (xₜ)',
      tagCell: 'Recurrent Cell (RNN Cell)',
      tagOutput: 'Prediction at time t (ŷₜ)',
      alarmLabel: 'Alarm Level in Memory (hₜ):',
      insightTitle: 'What is happening right now?',
      stableEval: 'Stable Evaluation',
      alertEval: '⚠️ CLINICAL ALERT',
      lowRiskEval: 'Low Risk / Infection Ruled Out',
      tokens: [
        { word: 'Patient', desc: 'Initial neutral subject' },
        { word: 'presents', desc: 'Clinical observation verb' },
        { word: 'fever', desc: 'Symptom: Hidden state jumps to ALERT level' },
        { word: 'and pain', desc: 'Worsening: Memory accumulates high medical concern' },
        { word: 'but', desc: 'Adversative conjunction: Shifts semantic trajectory' },
        { word: 'lab tests', desc: 'Introduction of diagnostic evidence' },
        { word: 'ruled out', desc: 'Key negation: Neutralizes previous alarm symptoms' },
        { word: 'infection.', desc: 'Conclusion: Memory classifies as "Low Risk"' }
      ],
      compCards: [
        {
          title: 'Multilayer Perceptron (MLP)',
          tag: 'No Memory',
          desc: 'Reads all words simultaneously or in isolation. Cannot tell whether "ruled out" appeared before or after "infection".'
        },
        {
          title: 'Recurrent Network (RNN / LSTM)',
          tag: 'Sequential Memory',
          desc: 'Reads word-by-word step-by-step. Limitation: In very long texts, early memories fade away (Vanishing Gradient).'
        },
        {
          title: 'Transformer (Attention)',
          tag: 'Direct Self-Attention',
          desc: 'The architecture behind ChatGPT: connects all words directly with each other in parallel without sequential bottlenecks, capturing massive contexts.'
        }
      ]
    },
    llm: {
      badge: 'Natural Language Processing (NLP)',
      title: 'How does an LLM Work Inside? From Text to Probabilities',
      desc: 'Models like ChatGPT or Gemini don\'t read words like humans nor do they look up pre-recorded answers. Below is a live animation of the 3 fundamental steps: Tokenization (numerical chunking), Self-Attention (contextual comprehension), and Autoregressive Prediction (guessing the next piece).',
      examplesLabel: 'Guided Examples:',
      customPlaceholder: 'Type any sentence here to see how it tokenizes...',
      resetPhrase: 'Reset Sentence',
      stage1Badge: 'Step 1',
      stage1Title: 'Tokenization & ID Assignment (BPE)',
      stage1Sub: 'The sentence is divided into subwords and each receives a unique dictionary code (Vocabulary ID).',
      totalTokens: 'Total: {n} tokens',
      note: 'Notice colors and the _ symbol: leading spaces are part of the token. Compound words and inflections are split into prefixes and suffixes to save memory.',
      stage2Badge: 'Step 2',
      stage2Title: 'Self-Attention Mechanism',
      stage2Sub: 'Hover over any word to see how the Transformer connects words together to deduce the precise context.',
      hoverHint: 'Hover over a token',
      explInitial: 'Hover over a token to see which other words inform its contextual meaning.',
      stage3Badge: 'Step 3',
      stage3Title: 'Next Word Prediction (Softmax)',
      stage3Sub: 'The LLM calculates which token has the highest mathematical probability to continue the story.',
      predictNextBtn: 'Predict Next Token',
      autoGenBtn: 'Auto-Generate',
      pauseGenBtn: 'Pause',
      probColTitle: 'Probability Distribution for Next Token:',
      loopColTitle: 'The Autoregressive Loop:',
      loopStep1: 'Chooses the most probable token (or via sampling)',
      loopStep2: 'Appends it to the end of the text',
      loopStep3: 'Loops back to Step 1 with the expanded sentence',
      presets: {
        gato: {
          title: 'The Curious Cat',
          initialText: 'The cat drank'
        },
        bancoParque: {
          title: 'Meaning of "Bank" (Park Bench Context)',
          initialText: 'The park bench was'
        },
        bancoDinero: {
          title: 'Meaning of "Bank" (Financial Context)',
          initialText: 'I went to the bank to request a'
        }
      }
    },
    academy: {
      badge: 'Guided Interactive Challenges',
      title: 'Learn Deep Learning by Experimenting',
      desc: 'Solve these interactive challenges designed to intuitively grasp foundational concepts: from the geometric limit of single perceptrons to overfitting and regularization.',
      glossaryTitle: 'Visual Glossary of Core Concepts',
      missionsTitle: 'Hands-on Training Missions'
    }
  }
};
