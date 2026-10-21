# 🧠 NeuroLab: Playground Interactivo de Redes Neuronales con Casos Reales

> Inspirado en **TensorFlow Playground**, pero rediseñado desde cero con **problemas y datos del mundo real**, explicaciones didácticas paso a paso y exploración visual de los distintos tipos de arquitecturas de Deep Learning (**MLP**, **CNN**, **RNN** y **Transformers**).

---

## ✨ Características Principales

### 1. 🏥 Problemas del Mundo Real (Story-Driven Data)
En lugar de puntos matemáticos abstractos ($x_1, x_2$), cada caso representa un problema tangible con unidades de medida reales y contexto de dominio:
- **Diagnóstico Médico (Diabetes Tipo 2)**: Predice el riesgo a partir del nivel de glucosa en ayunas ($mg/dL$) y el Índice de Masa Corporal ($IMC$). Descubre por qué un paciente con IMC alto y glucosa moderada ya corre peligro y cómo la red aprende la curvatura metabólica.
- **Ciberseguridad Bancaria (Fraude en Tarjetas)**: Clasifica transacciones legítimas versus anómalas según el importe del gasto ($€$) y la distancia al domicilio ($km$). Aprende a resolver fronteras circulares y aisladas.
- **Vehículos Autónomos (Frenado de Emergencia)**: Toma decisiones de frenado en milisegundos a partir de la distancia al obstáculo frontal ($m$) y la velocidad ($km/h$). Visualiza cómo la red deduce la parábola de desaceleración cinemática física ($d \propto v^2$).
- **Industria 4.0 (Control de Calidad Óptico)**: Componentes clasificados mediante tolerancia dimensional ($\mu m$) y densidad del material ($\%$). Simula un problema multimodal no lineal tipo XOR.
- **Sector Inmobiliario (Tasación Continua)**: Modelo de regresión que estima el precio de mercado ($€$) a partir de metros cuadrados y proximidad a servicios urbanos.

---

### 2. 🔬 Microscopio Neuronal Interactivo
Haz clic en cualquier neurona del diagrama sináptico para abrir el **Microscopio Neuronal**. Verás desglosado en tiempo real:
- Cada valor de entrada ($a_i$).
- El peso sináptico asociado ($w_i$) y su producto ponderado.
- El sesgo (**Bias** $b$).
- La suma lineal neta:
  $$z = \sum_{i=1}^n (w_i \cdot a_i) + b$$
- La función de activación aplicada:
  $$a = f(z)$$
- Una explicación didáctica de por qué la neurona está activa o inhibida.

---

### 3. 🎯 Frontera de Decisión con Sonda Personalizada (Custom Probe)
- **Heatmap Continuo en Tiempo Real**: Degrada suavemente las probabilidades del espacio de decisión a 60 FPS.
- **Diferenciación de Train y Test**: Puntos sólidos para entrenamiento y anillos concéntricos para evaluación de generalización.
- **Interacción Directa**: Haz clic en cualquier lugar del mapa para colocar un caso personalizado (ej. un paciente con 140 mg/dL y 32 de IMC) y comprueba al instante qué porcentaje de certeza asigna la red.

---

### 4. 👁️ Módulo CNN: Visión por Computadora
- Conoce por qué las redes densas fallan al procesar imágenes (pérdida de coherencia espacial).
- **Kernels Convolucionales 3x3 Interactivos**: Sobel X (bordes verticales), Sobel Y (bordes horizontales), Realce (Sharpen) y Detector Laplaciano.
- **Receptive Field Animado**: Desplaza una ventana deslizante de 3x3 sobre una imagen médica para ver el producto punto acumulado paso a paso.
- **Capa de Max Pooling (2x2)**: Muestra cómo se reduce la dimensionalidad espacial preservando las características predominantes.

---

### 5. ⏳ Módulo RNN: Secuencias Temporales y Memoria
- Comprende cómo procesan el lenguaje y las series de tiempo las **Redes Recurrentes**.
- **Análisis de Texto Clínico**: Avanza palabra por palabra a lo largo de la frase *"Paciente presenta fiebre y dolor pero el análisis descartó infección"*.
- **Medidor del Estado Oculto ($h_t$)**: Observa cómo la memoria interna acumula preocupación y cómo una palabra clave de negación ("descartó") neutraliza los síntomas anteriores.
- **Comparativa Interactiva**: MLP vs. RNN vs. Transformers (Mecanismo de Auto-Atención).

---

### 6. 🎓 Academia & Retos Didácticos
Cuatro misiones prácticas para resolver con un clic:
1. **La Trampa de la Línea Recta (Perceptrón)**: Demuestra por qué 0 capas ocultas no pueden separar regiones concéntricas.
2. **El Poder de la No Linealidad y ReLU**: Añade capas ocultas y observa el plegado del espacio.
3. **El Monstruo del Sobreajuste (Overfitting)**: Experimenta qué ocurre al usar demasiadas neuronas con ruido y cómo la regularización L2 devuelve la capacidad de generalización.
4. **La Física de los Coches Autónomos**: Ajusta hiperparámetros para modelar la distancia de frenado cuadrática.
- **Glosario Visual**: Definiciones y analogías de la vida real para *Backpropagation*, *Gradiente Descendente*, *Learning Rate*, *Bias* y *Pesos*.

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo Vite
npm run dev

# 3. Compilar para producción (opcional)
npm run build
```

Abre en tu navegador:
`http://localhost:5173/`

---

## 🛠️ Tecnologías Utilizadas
- **HTML5 Canvas & SVG Dinámico**: Renderizado de alta resolución para la arquitectura de red y el mapa de frontera de decisión.
- **Vanilla ES6 Modules**: Motor de red neuronal propio con optimizador Adam, retropropagación vectorial y regularización L1/L2 sin dependencias pesadas.
- **Web Audio API**: Sonidos sintetizados sutiles para retroalimentación auditiva interactiva.
- **Vite**: Entorno de desarrollo ultrarrápido y empaquetador moderno.
- **CSS3 Dark Glassmorphism**: Interfaz estética cuidada con paleta neón, desenfoques y tipografía *Plus Jakarta Sans* y *JetBrains Mono*.
