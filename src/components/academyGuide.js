/**
 * Academia y Misiones Didácticas Guiadas
 * Proporciona retos interactivos con un clic para que el usuario experimente
 * y comprenda los conceptos fundamentales sin frustración.
 */

export class AcademyGuide {
  constructor(containerEl, onApplyMission) {
    this.container = containerEl;
    this.onApplyMission = onApplyMission;

    this.missions = [
      {
        id: 'mission-linear-limit',
        title: 'Misión 1: La Trampa de la Línea Recta (Perceptrón)',
        category: 'Fundamentos',
        difficulty: 'Básico',
        badgeColor: '#38bdf8',
        problemId: 'fraud',
        config: {
          hiddenLayers: [], // 0 capas ocultas
          activation: 'linear',
          learningRate: 0.05,
          regularization: 'none'
        },
        desc: 'Un perceptrón simple sin capas ocultas solo puede trazar una línea recta estricta. Intenta separar las transacciones bancarias fraudulentas (que forman una región concéntrica en el mapa) con 0 capas ocultas.',
        testPrompt: 'Observa cómo la precisión no puede pasar del ~50-60%. ¡Es matemáticamente imposible separar un círculo con una sola recta!',
        actionText: 'Cargar Misión: Probar 0 Capas'
      },
      {
        id: 'mission-hidden-magic',
        title: 'Misión 2: El Poder de la Capa Oculta y ReLU',
        category: 'No Linealidad',
        difficulty: 'Intermedio',
        badgeColor: '#10b981',
        problemId: 'fraud',
        config: {
          hiddenLayers: [6, 4],
          activation: 'relu',
          learningRate: 0.03,
          regularization: 'none'
        },
        desc: 'Ahora dale a la red 2 capas ocultas con activación ReLU. Cada neurona aprenderá un semiplano y, al combinarse, doblarán el espacio hasta crear una frontera cerrada envolvente.',
        testPrompt: 'Inicia el entrenamiento y observa cómo la frontera se adapta mágicamente al círculo de transacciones legítimas superando el 95% de precisión.',
        actionText: 'Cargar Misión: Resolver con ReLU'
      },
      {
        id: 'mission-overfitting',
        title: 'Misión 3: El Monstruo del Sobreajuste (Overfitting)',
        category: 'Generalización',
        difficulty: 'Avanzado',
        badgeColor: '#f59e0b',
        problemId: 'diabetes',
        config: {
          hiddenLayers: [8, 8, 8],
          activation: 'tanh',
          learningRate: 0.04,
          regularization: 'none'
        },
        desc: '¿Más neuronas siempre es mejor? Cuando una red tiene demasiados parámetros libres, "memoriza" el ruido de los pacientes individuales en lugar de aprender el patrón real de diabetes.',
        testPrompt: 'Entrena y verás cómo la frontera crea islas extrañas. Luego, activa la Regularización L2 para suavizar la frontera y mejorar la precisión en Test.',
        actionText: 'Cargar Misión: Simular Sobreajuste'
      },
      {
        id: 'mission-physics-curve',
        title: 'Misión 4: La Física de los Coches Autónomos',
        category: 'Casos Reales',
        difficulty: 'Intermedio',
        badgeColor: '#ec4899',
        problemId: 'autonomous',
        config: {
          hiddenLayers: [4, 2],
          activation: 'relu',
          learningRate: 0.03,
          regularization: 'l2',
          regularizationRate: 0.001
        },
        desc: 'La distancia de frenado aumenta con el cuadrado de la velocidad (v²). Comprueba cómo una pequeña red de 4 y 2 neuronas deduce la curva parabólica de la física cinemática.',
        testPrompt: 'Haz clic en el mapa cerca del límite para probar qué decide el coche ante distintos límites de velocidad y distancia.',
        actionText: 'Cargar Misión: Conducción Autónoma'
      }
    ];

    this.glossary = [
      {
        term: 'Neurona Artificial',
        icon: 'fa-circle-dot',
        definition: 'Unidad matemática básica. Recibe varias señales de entrada, las multiplica por sus pesos, les suma un sesgo y aplica una función de activación para decidir si transmite señal o no.',
        analogy: 'Como un interruptor de luz con potenciómetro: solo se enciende si la suma de corriente supera cierta resistencia.'
      },
      {
        term: 'Peso Sináptico (Weight w)',
        icon: 'fa-dumbbell',
        definition: 'La fuerza de conexión entre dos neuronas. Si es positivo, amplifica la señal; si es negativo, la inhibe o castiga.',
        analogy: 'Como la importancia que le das a un consejo de un amigo de confianza versus alguien que siempre se equivoca.'
      },
      {
        term: 'Sesgo (Bias b)',
        icon: 'fa-sliders',
        definition: 'Un valor constante que desplaza la función de activación, permitiendo a la neurona estar activa incluso si todas las entradas son cero.',
        analogy: 'Tu umbral de frío personal: algunas personas encienden la calefacción a 18°C y otras a 15°C.'
      },
      {
        term: 'Backpropagation (Retropropagación)',
        icon: 'fa-rotate-left',
        definition: 'El algoritmo matemático que calcula exactamente qué porcentaje de culpa tuvo cada peso en el error final de la predicción, propagando el gradiente desde la salida hacia la entrada.',
        analogy: 'El análisis de una jugada de fútbol tras encajar un gol: el entrenador evalúa a cada jugador desde el portero hasta los delanteros para ajustar sus posiciones.'
      },
      {
        term: 'Gradiente Descendente (Gradient Descent)',
        icon: 'fa-mountain',
        definition: 'El método de optimización que ajusta los pesos paso a paso en la dirección que reduce el error (Loss).',
        analogy: 'Bajar de una montaña cubierta de niebla: no ves la cima ni el valle, pero palpas el suelo y das un paso hacia donde la pendiente desciende.'
      },
      {
        term: 'Tasa de Aprendizaje (Learning Rate)',
        icon: 'fa-gauge-high',
        definition: 'El tamaño del paso que da el optimizador en cada actualización de pesos.',
        analogy: 'Si das pasos de gigante, puedes saltarte el valle y caerte por el barranco (divergencia); si das pasos milimétricos, tardarás semanas en llegar.'
      }
    ];

    this.initDOM();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="academy-section">
        <div class="module-intro">
          <div class="intro-badge"><i class="fa-solid fa-graduation-cap"></i> Academia & Desafíos Prácticos</div>
          <h2>Aprende Experimentando con Retos Reales</h2>
          <p>
            No hay mejor forma de comprender una red neuronal que verla equivocarse y corregirse.
            Selecciona una de las siguientes misiones preparadas para cargar los parámetros exactos
            y comprobar cómo responde la red.
          </p>
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
            <h3>Glosario Visual de Conceptos Clave</h3>
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
                  <strong>💡 Analogía de la vida real:</strong> ${g.analogy}
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
