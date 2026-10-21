/**
 * Generador de Datasets de Problemas Reales con Soporte Bilingüe (ES / EN)
 * Cada dataset tiene contexto de dominio, etiquetas significativas y características reales.
 */

import { getLang } from '../i18n/index.js';

export const REAL_WORLD_PROBLEMS = {
  diabetes: {
    id: 'diabetes',
    icon: 'fa-heart-pulse',
    type: 'classification',
    min1: 70, max1: 220,
    min2: 18, max2: 42,
    colors: ['#10b981', '#f43f5e'],
    symbols: ['🟢', '🔴'],

    i18n: {
      es: {
        name: 'Diagnóstico Médico: Riesgo de Diabetes',
        category: 'Salud y Medicina',
        f1Name: 'Nivel de Glucosa',
        f1Unit: 'mg/dL',
        f1Range: '70 - 100 mg/dL',
        f2Name: 'Índice de Masa Corporal (IMC)',
        f2Unit: 'kg/m²',
        f2Range: '18.5 - 24.9 kg/m²',
        classes: ['Sano / Normal', 'Riesgo / Diabético'],
        story: 'Predecir si un paciente desarrollará diabetes tipo 2 según su glucosa y su IMC.',
        insight: 'La frontera es curva: un IMC alto con glucosa moderada ya es peligroso. Una simple línea recta deja fuera muchos casos críticos.',
        class0Label: 'Sano',
        class1Label: 'Diabético'
      },
      en: {
        name: 'Medical Diagnosis: Diabetes Risk',
        category: 'Health & Medicine',
        f1Name: 'Fasting Glucose Level',
        f1Unit: 'mg/dL',
        f1Range: '70 - 100 mg/dL',
        f2Name: 'Body Mass Index (BMI)',
        f2Unit: 'kg/m²',
        f2Range: '18.5 - 24.9 kg/m²',
        classes: ['Healthy / Normal', 'Risk / Diabetic'],
        story: 'Predict whether a patient develops type 2 diabetes based on blood glucose and BMI.',
        insight: 'The boundary is curved: high BMI with moderate glucose is already risky. A straight line misses critical cases.',
        class0Label: 'Healthy',
        class1Label: 'Diabetic'
      }
    },

    get name() { return this.i18n[getLang()]?.name || this.i18n.es.name; },
    get category() { return this.i18n[getLang()]?.category || this.i18n.es.category; },
    get story() { return this.i18n[getLang()]?.story || this.i18n.es.story; },
    get insight() { return this.i18n[getLang()]?.insight || this.i18n.es.insight; },
    get feature1() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return { name: loc.f1Name, unit: loc.f1Unit, min: this.min1, max: this.max1, normalRange: loc.f1Range };
    },
    get feature2() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return { name: loc.f2Name, unit: loc.f2Unit, min: this.min2, max: this.max2, normalRange: loc.f2Range };
    },
    get classes() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return [
        { label: loc.classes[0], color: this.colors[0], symbol: this.symbols[0] },
        { label: loc.classes[1], color: this.colors[1], symbol: this.symbols[1] }
      ];
    },

    generate(count = 250, noise = 0.1) {
      const data = [];
      const lang = getLang();
      const loc = this.i18n[lang] || this.i18n.es;

      for (let i = 0; i < count; i++) {
        const x1 = (Math.random() * 2 - 1);
        const x2 = (Math.random() * 2 - 1);
        
        const rawScore = 0.8 * x1 + 0.6 * x2 + 0.5 * (x1 * x2) - 0.1;
        const noisyScore = rawScore + (Math.random() * 2 - 1) * noise * 0.8;
        const label = noisyScore > 0 ? 1 : 0;

        const realX1 = Math.round(70 + ((x1 + 1) / 2) * (220 - 70));
        const realX2 = Number((18 + ((x2 + 1) / 2) * (42 - 18)).toFixed(1));

        data.push({
          x1, x2, realX1, realX2, label,
          info: `${loc.f1Name}: ${realX1} ${loc.f1Unit}, ${loc.f2Name}: ${realX2} ${loc.f2Unit} → ${label === 1 ? loc.class1Label : loc.class0Label}`
        });
      }
      return data;
    }
  },

  fraud: {
    id: 'fraud',
    icon: 'fa-shield-halved',
    type: 'classification',
    min1: 5, max1: 2500,
    min2: 1, max2: 800,
    colors: ['#06b6d4', '#f97316'],
    symbols: ['🔵', '🟠'],

    i18n: {
      es: {
        name: 'Ciberseguridad: Detección de Fraude en Tarjetas',
        category: 'Finanzas y Banca',
        f1Name: 'Importe de Transacción',
        f1Unit: '€',
        f1Range: '5 - 150 €',
        f2Name: 'Distancia al Domicilio',
        f2Unit: 'km',
        f2Range: '1 - 25 km',
        classes: ['Transacción Habitual', 'Fraude Sospechoso'],
        story: 'Detectar movimientos bancarios fraudulentos analizando el importe gastado y la distancia al domicilio.',
        insight: 'Las transacciones normales se concentran en el centro. El fraude surge en zonas concéntricas atípicas o esquinas anómalas (problema circular no lineal).',
        class0Label: 'Aprobada',
        class1Label: 'Alerta Fraude'
      },
      en: {
        name: 'Cybersecurity: Credit Card Fraud Detection',
        category: 'Finance & Banking',
        f1Name: 'Transaction Amount',
        f1Unit: '€',
        f1Range: '5 - 150 €',
        f2Name: 'Distance to Residence',
        f2Unit: 'km',
        f2Range: '1 - 25 km',
        classes: ['Regular Transaction', 'Suspicious Fraud'],
        story: 'Detect fraudulent banking activity by analyzing transaction amounts and distance from home.',
        insight: 'Normal purchases cluster in the center. Fraud occurs in concentric rings or extreme corners (non-linear circular problem).',
        class0Label: 'Approved',
        class1Label: 'Fraud Alert'
      }
    },

    get name() { return this.i18n[getLang()]?.name || this.i18n.es.name; },
    get category() { return this.i18n[getLang()]?.category || this.i18n.es.category; },
    get story() { return this.i18n[getLang()]?.story || this.i18n.es.story; },
    get insight() { return this.i18n[getLang()]?.insight || this.i18n.es.insight; },
    get feature1() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return { name: loc.f1Name, unit: loc.f1Unit, min: this.min1, max: this.max1, normalRange: loc.f1Range };
    },
    get feature2() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return { name: loc.f2Name, unit: loc.f2Unit, min: this.min2, max: this.max2, normalRange: loc.f2Range };
    },
    get classes() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return [
        { label: loc.classes[0], color: this.colors[0], symbol: this.symbols[0] },
        { label: loc.classes[1], color: this.colors[1], symbol: this.symbols[1] }
      ];
    },

    generate(count = 250, noise = 0.1) {
      const data = [];
      const lang = getLang();
      const loc = this.i18n[lang] || this.i18n.es;

      for (let i = 0; i < count; i++) {
        const x1 = (Math.random() * 2 - 1);
        const x2 = (Math.random() * 2 - 1);

        const distFromCenter = Math.sqrt(x1 * x1 + x2 * x2);
        const isAnomaly = distFromCenter > 0.58 || (Math.abs(x1) > 0.75 && Math.abs(x2) > 0.75);
        
        let label = isAnomaly ? 1 : 0;
        if (Math.random() < noise * 0.4) {
          label = 1 - label;
        }

        const realX1 = Math.round(5 + ((x1 + 1) / 2) * (2500 - 5));
        const realX2 = Math.round(1 + ((x2 + 1) / 2) * (800 - 1));

        data.push({
          x1, x2, realX1, realX2, label,
          info: `${loc.f1Name}: ${realX1}${loc.f1Unit}, ${loc.f2Name}: ${realX2}${loc.f2Unit} → ${label === 1 ? loc.class1Label : loc.class0Label}`
        });
      }
      return data;
    }
  },

  autonomous: {
    id: 'autonomous',
    icon: 'fa-car-burst',
    type: 'classification',
    min1: 2, max1: 100,
    min2: 20, max2: 150,
    colors: ['#10b981', '#ef4444'],
    symbols: ['🟢', '🔴'],

    i18n: {
      es: {
        name: 'Coche Autónomo: Frenado de Emergencia',
        category: 'Movilidad e IA',
        f1Name: 'Distancia al Obstáculo',
        f1Unit: 'metros',
        f1Range: 'Mayor a 30m',
        f2Name: 'Velocidad del Vehículo',
        f2Unit: 'km/h',
        f2Range: '50 - 90 km/h',
        classes: ['Circulación Segura', 'Frenado de Emergencia'],
        story: 'El sistema de piloto automático debe decidir en milisegundos si activa los frenos de emergencia para evitar un choque.',
        insight: 'La distancia de frenado crece con el cuadrado de la velocidad (cinemática física: d ∝ v²). Requiere que la red aprenda la parábola física.',
        class0Label: 'Vía Libre',
        class1Label: '¡FRENAR!'
      },
      en: {
        name: 'Autonomous Vehicle: Emergency Braking',
        category: 'Mobility & AI',
        f1Name: 'Obstacle Distance',
        f1Unit: 'meters',
        f1Range: 'Above 30m',
        f2Name: 'Vehicle Speed',
        f2Unit: 'km/h',
        f2Range: '50 - 90 km/h',
        classes: ['Safe Cruising', 'Emergency Braking'],
        story: 'Autopilot system must decide in milliseconds whether to trigger emergency brakes to prevent collision.',
        insight: 'Braking distance scales quadratically with speed (physics: d ∝ v²). Requires the network to learn the kinematic parabola.',
        class0Label: 'Clear Path',
        class1Label: 'BRAKE!'
      }
    },

    get name() { return this.i18n[getLang()]?.name || this.i18n.es.name; },
    get category() { return this.i18n[getLang()]?.category || this.i18n.es.category; },
    get story() { return this.i18n[getLang()]?.story || this.i18n.es.story; },
    get insight() { return this.i18n[getLang()]?.insight || this.i18n.es.insight; },
    get feature1() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return { name: loc.f1Name, unit: loc.f1Unit, min: this.min1, max: this.max1, normalRange: loc.f1Range };
    },
    get feature2() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return { name: loc.f2Name, unit: loc.f2Unit, min: this.min2, max: this.max2, normalRange: loc.f2Range };
    },
    get classes() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return [
        { label: loc.classes[0], color: this.colors[0], symbol: this.symbols[0] },
        { label: loc.classes[1], color: this.colors[1], symbol: this.symbols[1] }
      ];
    },

    generate(count = 250, noise = 0.1) {
      const data = [];
      const lang = getLang();
      const loc = this.i18n[lang] || this.i18n.es;

      for (let i = 0; i < count; i++) {
        const x1 = (Math.random() * 2 - 1);
        const x2 = (Math.random() * 2 - 1);

        const physicalThreshold = 0.85 * Math.pow(x2 + 0.2, 2) - 0.45;
        let label = (x1 < physicalThreshold) ? 1 : 0;
        
        if (Math.random() < noise * 0.35) {
          label = 1 - label;
        }

        const realX1 = Math.round(2 + ((x1 + 1) / 2) * (100 - 2));
        const realX2 = Math.round(20 + ((x2 + 1) / 2) * (150 - 20));

        data.push({
          x1, x2, realX1, realX2, label,
          info: `${loc.f1Name}: ${realX1}${loc.f1Unit}, ${loc.f2Name}: ${realX2}${loc.f2Unit} → ${label === 1 ? loc.class1Label : loc.class0Label}`
        });
      }
      return data;
    }
  },

  quality: {
    id: 'quality',
    icon: 'fa-gears',
    type: 'classification',
    min1: -50, max1: 50,
    min2: 75, max2: 100,
    colors: ['#8b5cf6', '#eab308'],
    symbols: ['🟣', '🟡'],

    i18n: {
      es: {
        name: 'Industria 4.0: Control de Calidad Láser',
        category: 'Ingeniería y Manufactura',
        f1Name: 'Tolerancia Dimensional',
        f1Unit: 'μm',
        f1Range: '-15 a +15 μm',
        f2Name: 'Densidad Superficial',
        f2Unit: '%',
        f2Range: '92 - 98 %',
        classes: ['Pieza Aceptada (Grado A)', 'Pieza Defectuosa'],
        story: 'Un sensor óptico clasifica componentes aeronáuticos. Solo las piezas con una combinación equilibrada y simétrica son válidas (Problema tipo XOR/Multimodal).',
        insight: 'Las piezas buenas están en dos cuadrantes cruzados o dentro de un rango simétrico. Un clasificador lineal simple tiene 50% de error aquí.',
        class0Label: 'Defectuosa',
        class1Label: 'Aceptada'
      },
      en: {
        name: 'Industry 4.0: Laser Quality Inspection',
        category: 'Engineering & Manufacturing',
        f1Name: 'Dimensional Tolerance',
        f1Unit: 'μm',
        f1Range: '-15 to +15 μm',
        f2Name: 'Surface Density',
        f2Unit: '%',
        f2Range: '92 - 98 %',
        classes: ['Accepted Component (Grade A)', 'Defective Component'],
        story: 'Optical laser sensor classifies aerospace parts. Only components with balanced symmetrical specs pass (XOR/Multimodal problem).',
        insight: 'Passing components lie in cross quadrants. A single linear classifier achieves at best 50% accuracy here.',
        class0Label: 'Defective',
        class1Label: 'Accepted'
      }
    },

    get name() { return this.i18n[getLang()]?.name || this.i18n.es.name; },
    get category() { return this.i18n[getLang()]?.category || this.i18n.es.category; },
    get story() { return this.i18n[getLang()]?.story || this.i18n.es.story; },
    get insight() { return this.i18n[getLang()]?.insight || this.i18n.es.insight; },
    get feature1() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return { name: loc.f1Name, unit: loc.f1Unit, min: this.min1, max: this.max1, normalRange: loc.f1Range };
    },
    get feature2() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return { name: loc.f2Name, unit: loc.f2Unit, min: this.min2, max: this.max2, normalRange: loc.f2Range };
    },
    get classes() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return [
        { label: loc.classes[0], color: this.colors[0], symbol: this.symbols[0] },
        { label: loc.classes[1], color: this.colors[1], symbol: this.symbols[1] }
      ];
    },

    generate(count = 250, noise = 0.1) {
      const data = [];
      const lang = getLang();
      const loc = this.i18n[lang] || this.i18n.es;

      for (let i = 0; i < count; i++) {
        const x1 = (Math.random() * 2 - 1);
        const x2 = (Math.random() * 2 - 1);

        const score = x1 * x2;
        let label = (score > 0.05) ? 1 : 0;

        if (Math.random() < noise * 0.3) {
          label = 1 - label;
        }

        const realX1 = Math.round(-50 + ((x1 + 1) / 2) * 100);
        const realX2 = Number((75 + ((x2 + 1) / 2) * 25).toFixed(1));

        data.push({
          x1, x2, realX1, realX2, label,
          info: `${loc.f1Name}: ${realX1}${loc.f1Unit}, ${loc.f2Name}: ${realX2}${loc.f2Unit} → ${label === 1 ? loc.class1Label : loc.class0Label}`
        });
      }
      return data;
    }
  },

  housing: {
    id: 'housing',
    icon: 'fa-building',
    type: 'regression',
    min1: 40, max1: 240,
    min2: 1, max2: 10,
    colors: ['#38bdf8', '#ec4899'],
    symbols: ['🔹', '🔸'],

    i18n: {
      es: {
        name: 'Sector Inmobiliario: Tasación de Viviendas',
        category: 'Economía y Urbanismo',
        f1Name: 'Superficie de la Vivienda',
        f1Unit: 'm²',
        f1Range: '70 - 120 m²',
        f2Name: 'Índice de Conectividad Urbana',
        f2Unit: 'pts (1-10)',
        f2Range: '5 - 9 pts',
        classes: ['Precio Bajo / Accesible', 'Precio Alto / Premium'],
        story: 'Predecir el valor continuo de mercado de un inmueble en función de su espacio y su cercanía al transporte y servicios.',
        insight: 'En regresión, la salida de la red no es una probabilidad 0 o 1, sino un valor continuo. La red aprende una superficie tridimensional suave.',
        priceLabel: 'Valor'
      },
      en: {
        name: 'Real Estate: Property Valuation',
        category: 'Economics & Urban Planning',
        f1Name: 'Living Space Area',
        f1Unit: 'm²',
        f1Range: '70 - 120 m²',
        f2Name: 'Urban Transit Index',
        f2Unit: 'pts (1-10)',
        f2Range: '5 - 9 pts',
        classes: ['Affordable / Lower Price', 'Premium / Higher Price'],
        story: 'Predict continuous fair market property value from living space and connectivity to transport and services.',
        insight: 'In regression, the network output is not a 0/1 probability, but a continuous real number representing market price.',
        priceLabel: 'Value'
      }
    },

    get name() { return this.i18n[getLang()]?.name || this.i18n.es.name; },
    get category() { return this.i18n[getLang()]?.category || this.i18n.es.category; },
    get story() { return this.i18n[getLang()]?.story || this.i18n.es.story; },
    get insight() { return this.i18n[getLang()]?.insight || this.i18n.es.insight; },
    get feature1() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return { name: loc.f1Name, unit: loc.f1Unit, min: this.min1, max: this.max1, normalRange: loc.f1Range };
    },
    get feature2() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return { name: loc.f2Name, unit: loc.f2Unit, min: this.min2, max: this.max2, normalRange: loc.f2Range };
    },
    get classes() {
      const loc = this.i18n[getLang()] || this.i18n.es;
      return [
        { label: loc.classes[0], color: this.colors[0], symbol: this.symbols[0] },
        { label: loc.classes[1], color: this.colors[1], symbol: this.symbols[1] }
      ];
    },

    generate(count = 250, noise = 0.1) {
      const data = [];
      const lang = getLang();
      const loc = this.i18n[lang] || this.i18n.es;

      for (let i = 0; i < count; i++) {
        const x1 = (Math.random() * 2 - 1);
        const x2 = (Math.random() * 2 - 1);

        let continuousValue = 0.5 + 0.3 * x1 + 0.25 * x2 + 0.15 * (x1 * x2);
        continuousValue += (Math.random() * 2 - 1) * noise * 0.25;
        continuousValue = Math.max(0.05, Math.min(0.95, continuousValue));

        const label = continuousValue > 0.5 ? 1 : 0;
        const realX1 = Math.round(40 + ((x1 + 1) / 2) * (240 - 40));
        const realX2 = Number((1 + ((x2 + 1) / 2) * 9).toFixed(1));
        const realPrice = Math.round(80000 + continuousValue * 450000);

        data.push({
          x1, x2, realX1, realX2, label,
          targetValue: continuousValue,
          info: `${loc.f1Name}: ${realX1}${loc.f1Unit}, ${loc.f2Name}: ${realX2}/10 → ${loc.priceLabel}: ${realPrice.toLocaleString()} €`
        });
      }
      return data;
    }
  }
};
