/**
 * Generador de Datasets de Problemas Reales
 * Cada dataset tiene contexto de dominio, etiquetas significativas y características reales.
 */

export const REAL_WORLD_PROBLEMS = {
  diabetes: {
    id: 'diabetes',
    name: 'Diagnóstico Médico: Riesgo de Diabetes',
    category: 'Salud y Medicina',
    icon: 'fa-heart-pulse',
    type: 'classification',
    feature1: {
      name: 'Nivel de Glucosa',
      unit: 'mg/dL',
      min: 70,
      max: 220,
      normalRange: '70 - 100 mg/dL'
    },
    feature2: {
      name: 'Índice de Masa Corporal (IMC)',
      unit: 'kg/m²',
      min: 18,
      max: 42,
      normalRange: '18.5 - 24.9 kg/m²'
    },
    classes: [
      { label: 'Sano / Normal', color: '#10b981', symbol: '🟢' },
      { label: 'Riesgo / Diabético', color: '#f43f5e', symbol: '🔴' }
    ],
    story: 'Predecir si un paciente desarrollará diabetes tipo 2 según su glucosa y su IMC.',
    insight: 'La frontera es curva: un IMC alto con glucosa moderada ya es peligroso. Una simple línea recta deja fuera muchos casos críticos.',
    generate(count = 250, noise = 0.1) {
      const data = [];
      for (let i = 0; i < count; i++) {
        // x1: Glucosa [-1, 1], x2: IMC [-1, 1]
        const x1 = (Math.random() * 2 - 1);
        const x2 = (Math.random() * 2 - 1);
        
        // Función frontera realista con curvatura:
        // Alto x1 o combinación no lineal de x1 y x2
        const rawScore = 0.8 * x1 + 0.6 * x2 + 0.5 * (x1 * x2) - 0.1;
        const noisyScore = rawScore + (Math.random() * 2 - 1) * noise * 0.8;
        const label = noisyScore > 0 ? 1 : 0;

        // Desnormalizar a valores médicos reales para mostrar al usuario
        const realX1 = Math.round(70 + ((x1 + 1) / 2) * (220 - 70));
        const realX2 = Number((18 + ((x2 + 1) / 2) * (42 - 18)).toFixed(1));

        data.push({
          x1,
          x2,
          realX1,
          realX2,
          label,
          info: `Glucosa: ${realX1} mg/dL, IMC: ${realX2} kg/m² → ${label === 1 ? 'Diabético' : 'Sano'}`
        });
      }
      return data;
    }
  },

  fraud: {
    id: 'fraud',
    name: 'Ciberseguridad: Detección de Fraude en Tarjetas',
    category: 'Finanzas y Banca',
    icon: 'fa-shield-halved',
    type: 'classification',
    feature1: {
      name: 'Importe de Transacción',
      unit: '€',
      min: 5,
      max: 2500,
      normalRange: '5 - 150 €'
    },
    feature2: {
      name: 'Distancia al Domicilio',
      unit: 'km',
      min: 1,
      max: 800,
      normalRange: '1 - 25 km'
    },
    classes: [
      { label: 'Transacción Habitual', color: '#06b6d4', symbol: '🔵' },
      { label: 'Fraude Sospechoso', color: '#f97316', symbol: '🟠' }
    ],
    story: 'Detectar movimientos bancarios fraudulentos analizando el importe gastado y la distancia al domicilio.',
    insight: 'Las transacciones normales se concentran en el centro. El fraude surge en zonas concéntricas atípicas o esquinas anómalas (problema circular no lineal).',
    generate(count = 250, noise = 0.1) {
      const data = [];
      for (let i = 0; i < count; i++) {
        const x1 = (Math.random() * 2 - 1);
        const x2 = (Math.random() * 2 - 1);

        // Patrón concéntrico / de anomalía
        const distFromCenter = Math.sqrt(x1 * x1 + x2 * x2);
        const isAnomaly = distFromCenter > 0.58 || (Math.abs(x1) > 0.75 && Math.abs(x2) > 0.75);
        
        let label = isAnomaly ? 1 : 0;
        if (Math.random() < noise * 0.4) {
          label = 1 - label; // Invertir por ruido
        }

        const realX1 = Math.round(5 + ((x1 + 1) / 2) * (2500 - 5));
        const realX2 = Math.round(1 + ((x2 + 1) / 2) * (800 - 1));

        data.push({
          x1,
          x2,
          realX1,
          realX2,
          label,
          info: `Importe: ${realX1}€, Distancia: ${realX2}km → ${label === 1 ? 'Alerta Fraude' : 'Aprobada'}`
        });
      }
      return data;
    }
  },

  autonomous: {
    id: 'autonomous',
    name: 'Coche Autónomo: Frenado de Emergencia',
    category: 'Movilidad e IA',
    icon: 'fa-car-burst',
    type: 'classification',
    feature1: {
      name: 'Distancia al Obstáculo',
      unit: 'metros',
      min: 2,
      max: 100,
      normalRange: 'Mayor a 30m'
    },
    feature2: {
      name: 'Velocidad del Vehículo',
      unit: 'km/h',
      min: 20,
      max: 150,
      normalRange: '50 - 90 km/h'
    },
    classes: [
      { label: 'Circulación Segura', color: '#10b981', symbol: '🟢' },
      { label: 'Frenado de Emergencia', color: '#ef4444', symbol: '🔴' }
    ],
    story: 'El sistema de piloto automático debe decidir en milisegundos si activa los frenos de emergencia para evitar un choque.',
    insight: 'La distancia de frenado crece con el cuadrado de la velocidad (cinemática física: d ∝ v²). Requiere que la red aprenda la parábola física.',
    generate(count = 250, noise = 0.1) {
      const data = [];
      for (let i = 0; i < count; i++) {
        const x1 = (Math.random() * 2 - 1); // Distancia (-1 cerca, +1 lejos)
        const x2 = (Math.random() * 2 - 1); // Velocidad (-1 lento, +1 rápido)

        // Física: A mayor velocidad y menor distancia -> colisión inminente
        // Frontera cuadrática: x1 < 0.8 * (x2 + 0.3)^2 - 0.4
        const physicalThreshold = 0.85 * Math.pow(x2 + 0.2, 2) - 0.45;
        let label = (x1 < physicalThreshold) ? 1 : 0;
        
        if (Math.random() < noise * 0.35) {
          label = 1 - label;
        }

        const realX1 = Math.round(2 + ((x1 + 1) / 2) * (100 - 2));
        const realX2 = Math.round(20 + ((x2 + 1) / 2) * (150 - 20));

        data.push({
          x1,
          x2,
          realX1,
          realX2,
          label,
          info: `Distancia: ${realX1}m, Velocidad: ${realX2}km/h → ${label === 1 ? '¡FRENAR!' : 'Vía Libre'}`
        });
      }
      return data;
    }
  },

  quality: {
    id: 'quality',
    name: 'Industria 4.0: Control de Calidad Láser',
    category: 'Ingeniería y Manufactura',
    icon: 'fa-gears',
    type: 'classification',
    feature1: {
      name: 'Tolerancia Dimensional',
      unit: 'μm',
      min: -50,
      max: 50,
      normalRange: '-15 a +15 μm'
    },
    feature2: {
      name: 'Densidad Superficial',
      unit: '%',
      min: 75,
      max: 100,
      normalRange: '92 - 98 %'
    },
    classes: [
      { label: 'Pieza Aceptada (Grado A)', color: '#8b5cf6', symbol: '🟣' },
      { label: 'Pieza Defectuosa', color: '#eab308', symbol: '🟡' }
    ],
    story: 'Un sensor óptico clasifica componentes aeronáuticos. Solo las piezas con una combinación equilibrada y simétrica son válidas (Problema tipo XOR/Multimodal).',
    insight: 'Las piezas buenas están en dos cuadrantes cruzados o dentro de un rango simétrico. Un clasificador lineal simple tiene 50% de error aquí.',
    generate(count = 250, noise = 0.1) {
      const data = [];
      for (let i = 0; i < count; i++) {
        const x1 = (Math.random() * 2 - 1);
        const x2 = (Math.random() * 2 - 1);

        // Estructura tipo XOR suavizada
        const score = x1 * x2;
        let label = (score > 0.05) ? 1 : 0;

        if (Math.random() < noise * 0.3) {
          label = 1 - label;
        }

        const realX1 = Math.round(-50 + ((x1 + 1) / 2) * 100);
        const realX2 = Number((75 + ((x2 + 1) / 2) * 25).toFixed(1));

        data.push({
          x1,
          x2,
          realX1,
          realX2,
          label,
          info: `Tolerancia: ${realX1}μm, Densidad: ${realX2}% → ${label === 1 ? 'Aceptada' : 'Defectuosa'}`
        });
      }
      return data;
    }
  },

  housing: {
    id: 'housing',
    name: 'Sector Inmobiliario: Tasación de Viviendas',
    category: 'Economía y Urbanismo',
    icon: 'fa-building',
    type: 'regression',
    feature1: {
      name: 'Superficie de la Vivienda',
      unit: 'm²',
      min: 40,
      max: 240,
      normalRange: '70 - 120 m²'
    },
    feature2: {
      name: 'Índice de Conectividad Urbana',
      unit: 'pts (1-10)',
      min: 1,
      max: 10,
      normalRange: '5 - 9 pts'
    },
    classes: [
      { label: 'Precio Bajo / Accesible', color: '#38bdf8', symbol: '🔹' },
      { label: 'Precio Alto / Premium', color: '#ec4899', symbol: '🔸' }
    ],
    story: 'Predecir el valor continuo de mercado de un inmueble en función de su espacio y su cercanía al transporte y servicios.',
    insight: 'En regresión, la salida de la red no es una probabilidad 0 o 1, sino un valor continuo. La red aprende una superficie tridimensional suave.',
    generate(count = 250, noise = 0.1) {
      const data = [];
      for (let i = 0; i < count; i++) {
        const x1 = (Math.random() * 2 - 1);
        const x2 = (Math.random() * 2 - 1);

        // Valor continuo entre [0, 1]
        let continuousValue = 0.5 + 0.3 * x1 + 0.25 * x2 + 0.15 * (x1 * x2);
        continuousValue += (Math.random() * 2 - 1) * noise * 0.25;
        continuousValue = Math.max(0.05, Math.min(0.95, continuousValue));

        // En modo clasificación mostramos si es de alta gama (> 0.5)
        const label = continuousValue > 0.5 ? 1 : 0;

        const realX1 = Math.round(40 + ((x1 + 1) / 2) * (240 - 40));
        const realX2 = Number((1 + ((x2 + 1) / 2) * 9).toFixed(1));
        const realPrice = Math.round(80000 + continuousValue * 450000);

        data.push({
          x1,
          x2,
          realX1,
          realX2,
          label,
          targetValue: continuousValue,
          info: `Área: ${realX1}m², Conectividad: ${realX2}/10 → Valor: ${realPrice.toLocaleString()} €`
        });
      }
      return data;
    }
  }
};
