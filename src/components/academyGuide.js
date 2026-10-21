import { getLang, onLangChange, t } from '../i18n/index.js';

/**
 * Academia y Misiones Didácticas Guiadas (Bilingüe ES / EN)
 */

export class AcademyGuide {
  constructor(containerEl, onApplyMission) {
    this.container = containerEl;
    this.onApplyMission = onApplyMission;

    this.missionsData = [
      {
        id: 'mission-linear-limit',
        badgeColor: '#38bdf8',
        problemId: 'fraud',
        config: {
          hiddenLayers: [],
          activation: 'linear',
          learningRate: 0.05,
          regularization: 'none'
        },
        i18n: {
          es: {
            title: 'Misión 1: La Trampa de la Línea Recta (Perceptrón)',
            category: 'Fundamentos',
            difficulty: 'Básico',
            desc: 'Un perceptrón simple sin capas ocultas solo puede trazar una línea recta estricta. Intenta separar las transacciones bancarias fraudulentas (que forman una región concéntrica en el mapa) con 0 capas ocultas.',
            testPrompt: 'Observa cómo la precisión no puede pasar del ~50-60%. ¡Es matemáticamente imposible separar un círculo con una sola recta!',
            actionText: 'Cargar Misión: Probar 0 Capas'
          },
          en: {
            title: 'Mission 1: The Straight Line Trap (Perceptron)',
            category: 'Foundations',
            difficulty: 'Basic',
            desc: 'A single perceptron without hidden layers can only draw a strict straight hyperplane. Try separating fraudulent banking transactions (which form a concentric cluster) using 0 hidden layers.',
            testPrompt: 'Notice how accuracy is capped at ~50-60%. It is mathematically impossible to isolate a circle with one straight line!',
            actionText: 'Load Mission: Test 0 Layers'
          }
        }
      },
      {
        id: 'mission-hidden-magic',
        badgeColor: '#10b981',
        problemId: 'fraud',
        config: {
          hiddenLayers: [6, 4],
          activation: 'relu',
          learningRate: 0.03,
          regularization: 'none'
        },
        i18n: {
          es: {
            title: 'Misión 2: El Poder de la Capa Oculta y ReLU',
            category: 'No Linealidad',
            difficulty: 'Intermedio',
            desc: 'Ahora dale a la red 2 capas ocultas con activación ReLU. Cada neurona aprenderá un semiplano y, al combinarse, doblarán el espacio hasta crear una frontera cerrada envolvente.',
            testPrompt: 'Inicia el entrenamiento y observa cómo la frontera se adapta mágicamente al círculo de transacciones legítimas superando el 95% de precisión.',
            actionText: 'Cargar Misión: Resolver con ReLU'
          },
          en: {
            title: 'Mission 2: Power of Hidden Layers & ReLU',
            category: 'Non-Linearity',
            difficulty: 'Intermediate',
            desc: 'Now equip the network with 2 hidden layers using ReLU activation. Each neuron learns a half-plane, folding space into an enclosing polygon boundary.',
            testPrompt: 'Start training and watch the boundary fold neatly around legitimate transactions, surging past 95% test accuracy.',
            actionText: 'Load Mission: Solve with ReLU'
          }
        }
      },
      {
        id: 'mission-overfitting',
        badgeColor: '#f59e0b',
        problemId: 'diabetes',
        config: {
          hiddenLayers: [8, 8, 8],
          activation: 'tanh',
          learningRate: 0.04,
          regularization: 'none'
        },
        i18n: {
          es: {
            title: 'Misión 3: El Monstruo del Sobreajuste (Overfitting)',
            category: 'Generalización',
            difficulty: 'Avanzado',
            desc: '¿Más neuronas siempre es mejor? Cuando una red tiene demasiados parámetros libres, "memoriza" el ruido de los pacientes individuales en lugar de aprender el patrón real de diabetes.',
            testPrompt: 'Entrena y verás cómo la frontera crea islas extrañas. Luego, activa la Regularización L2 para suavizar la frontera y mejorar la precisión en Test.',
            actionText: 'Cargar Misión: Simular Sobreajuste'
          },
          en: {
            title: 'Mission 3: The Overfitting Monster',
            category: 'Generalization',
            difficulty: 'Advanced',
            desc: 'Are more neurons always better? When a model has excessive free parameters, it memorizes individual noise rather than the underlying clinical rule.',
            testPrompt: 'Train and watch the boundary sprout weird islands. Then enable L2 Regularization to smooth the boundary and restore Test accuracy.',
            actionText: 'Load Mission: Simulate Overfitting'
          }
        }
      },
      {
        id: 'mission-physics-curve',
        badgeColor: '#ec4899',
        problemId: 'autonomous',
        config: {
          hiddenLayers: [4, 2],
          activation: 'relu',
          learningRate: 0.03,
          regularization: 'l2',
          regularizationRate: 0.001
        },
        i18n: {
          es: {
            title: 'Misión 4: La Física de los Coches Autónomos',
            category: 'Casos Reales',
            difficulty: 'Intermedio',
            desc: 'La distancia de frenado aumenta con el cuadrado de la velocidad (v²). Comprueba cómo una pequeña red de 4 y 2 neuronas deduce la curva parabólica de la física cinemática.',
            testPrompt: 'Haz clic en el mapa cerca del límite para probar qué decide el coche ante distintos límites de velocidad y distancia.',
            actionText: 'Cargar Misión: Conducción Autónoma'
          },
          en: {
            title: 'Mission 4: Physics of Autonomous Braking',
            category: 'Real-World Cases',
            difficulty: 'Intermediate',
            desc: 'Braking distance scales quadratically with speed (v²). Discover how a compact 4-2 neuron network deduces kinematic physics.',
            testPrompt: 'Click on the map near the threshold to test braking decisions across varying speeds and distances.',
            actionText: 'Load Mission: Autonomous Driving'
          }
        }
      }
    ];

    this.glossaryData = [
      {
        icon: 'fa-circle-dot',
        i18n: {
          es: {
            term: 'Neurona Artificial',
            definition: 'Unidad matemática básica. Recibe varias señales de entrada, las multiplica por sus pesos, les suma un sesgo y aplica una función de activación para decidir si transmite señal o no.',
            analogy: 'Como un interruptor de luz con potenciómetro: solo se enciende si la suma de corriente supera cierta resistencia.'
          },
          en: {
            term: 'Artificial Neuron',
            definition: 'Core mathematical unit. Receives input signals, multiplies them by weights, adds a bias, and applies an activation function to decide activation intensity.',
            analogy: 'Like a dimmer light switch: only turns on when the incoming electrical current exceeds an internal threshold.'
          }
        }
      },
      {
        icon: 'fa-dumbbell',
        i18n: {
          es: {
            term: 'Peso Sináptico (Weight w)',
            definition: 'La fuerza de conexión entre dos neuronas. Si es positivo, amplifica la señal; si es negativo, la inhibe o castiga.',
            analogy: 'Como la importancia que le das a un consejo de un amigo de confianza versus alguien que siempre se equivoca.'
          },
          en: {
            term: 'Synaptic Weight (w)',
            definition: 'The connection strength between two neurons. If positive, it amplifies signals; if negative, it inhibits or penalizes them.',
            analogy: 'Like how much value you place on advice from a trusted expert versus someone who is consistently wrong.'
          }
        }
      },
      {
        icon: 'fa-sliders',
        i18n: {
          es: {
            term: 'Sesgo (Bias b)',
            definition: 'Un valor constante que desplaza la función de activación, permitiendo a la neurona estar activa incluso si todas las entradas son cero.',
            analogy: 'Tu umbral de frío personal: algunas personas encienden la calefacción a 18°C y otras a 15°C.'
          },
          en: {
            term: 'Bias (b)',
            definition: 'A constant parameter that shifts the activation function curve horizontally, enabling neurons to fire even if all inputs are zero.',
            analogy: 'Your personal temperature tolerance: some people turn on heating at 18°C while others wait until 15°C.'
          }
        }
      },
      {
        icon: 'fa-rotate-left',
        i18n: {
          es: {
            term: 'Backpropagation (Retropropagación)',
            definition: 'El algoritmo matemático que calcula exactamente qué porcentaje de culpa tuvo cada peso en el error final de la predicción, propagando el gradiente desde la salida hacia la entrada.',
            analogy: 'El análisis de una jugada de fútbol tras encajar un gol: el entrenador evalúa a cada jugador desde el portero hasta los delanteros para ajustar sus posiciones.'
          },
          en: {
            term: 'Backpropagation',
            definition: 'The mathematical algorithm applying the chain rule to calculate the exact gradient error contribution of each weight from output back to input.',
            analogy: 'Reviewing game footage after conceding a goal: the coach evaluates each player from goalkeeper to forwards to adjust positions.'
          }
        }
      },
      {
        icon: 'fa-mountain',
        i18n: {
          es: {
            term: 'Gradiente Descendente (Gradient Descent)',
            definition: 'El método de optimización que ajusta los pesos paso a paso en la dirección que reduce el error (Loss).',
            analogy: 'Bajar de una montaña cubierta de niebla: no ves la cima ni el valle, pero palpas el suelo y das un paso hacia donde la pendiente desciende.'
          },
          en: {
            term: 'Gradient Descent',
            definition: 'The iterative optimization algorithm that updates weights step-by-step in the opposite direction of the gradient to minimize Loss.',
            analogy: 'Hiking down a fog-covered mountain: you cannot see the valley, but feel the slope underfoot and step downhill.'
          }
        }
      },
      {
        icon: 'fa-gauge-high',
        i18n: {
          es: {
            term: 'Tasa de Aprendizaje (Learning Rate α)',
            definition: 'El tamaño del paso que da el optimizador en cada actualización de pesos.',
            analogy: 'Si das pasos de gigante, puedes saltarte el valle y caerte por el barranco (divergencia); si das pasos milimétricos, tardarás semanas en llegar.'
          },
          en: {
            term: 'Learning Rate (α)',
            definition: 'The step size multiplier used by the optimizer when adjusting weights in each iteration.',
            analogy: 'Taking giant leaps risks overshooting the valley and falling off a cliff; taking microscopic steps takes weeks to reach the destination.'
          }
        }
      }
    ];

    this.initDOM();
    onLangChange(() => this.initDOM());
  }

  get missions() {
    const lang = getLang();
    return this.missionsData.map(m => {
      const loc = m.i18n[lang] || m.i18n.es;
      return {
        id: m.id,
        badgeColor: m.badgeColor,
        problemId: m.problemId,
        config: m.config,
        title: loc.title,
        category: loc.category,
        difficulty: loc.difficulty,
        desc: loc.desc,
        testPrompt: loc.testPrompt,
        actionText: loc.actionText
      };
    });
  }

  get glossary() {
    const lang = getLang();
    return this.glossaryData.map(g => {
      const loc = g.i18n[lang] || g.i18n.es;
      return {
        icon: g.icon,
        term: loc.term,
        definition: loc.definition,
        analogy: loc.analogy
      };
    });
  }

  initDOM() {
    const isEn = getLang() === 'en';
    this.container.innerHTML = `
      <div class="academy-section">
        <div class="module-intro">
          <div class="intro-badge"><i class="fa-solid fa-graduation-cap"></i> ${t('academy.badge')}</div>
          <h2>${t('academy.title')}</h2>
          <p>${t('academy.desc')}</p>
        </div>

        <div class="missions-grid">
          ${this.missions.map(m => `
            <div class="mission-card" id="${m.id}">
              <div class="mission-top">
                <span class="m-difficulty" style="background: ${m.badgeColor}22; color: ${m.badgeColor}; border: 1px solid ${m.badgeColor}44;">
                  ${m.difficulty}
                </span>
                <span class="m-category">${m.category}</span>
              </div>
              <h3>${m.title}</h3>
              <p class="mission-desc">${m.desc}</p>
              <div class="mission-prompt">
                <i class="fa-solid fa-crosshairs"></i>
                <span>${m.testPrompt}</span>
              </div>
              <button class="btn-mission-apply" data-mission-id="${m.id}">
                ${m.actionText} <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          `).join('')}
        </div>

        <div class="glossary-section">
          <div class="glossary-header">
            <i class="fa-solid fa-book-open"></i>
            <h3>${t('academy.glossaryTitle')}</h3>
          </div>
          <div class="glossary-grid">
            ${this.glossary.map(g => `
              <div class="glossary-card">
                <div class="glossary-card-top">
                  <i class="fa-solid ${g.icon} gloss-icon"></i>
                  <h4>${g.term}</h4>
                </div>
                <p class="gloss-def">${g.definition}</p>
                <div class="gloss-analogy">
                  <strong>💡 ${isEn ? 'Real-world analogy:' : 'Analogía de la vida real:'}</strong> ${g.analogy}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Bind mission buttons
    const btns = this.container.querySelectorAll('.btn-mission-apply');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const mId = btn.getAttribute('data-mission-id');
        const mission = this.missions.find(m => m.id === mId);
        if (mission && this.onApplyMission) {
          this.onApplyMission(mission);
        }
      });
    });
  }
}
