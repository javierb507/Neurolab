# 🧠 NeuroLab: Playground Interactivo de Redes Neuronales con Casos Reales

<div align="center">

[![Versión](https://img.shields.io/badge/versión-1.0.0-blue.svg)](https://github.com/javierb507/Neurolab/releases)
[![Licencia: GPL-3.0](https://img.shields.io/badge/Licencia-GPL--3.0-blue.svg)](./LICENSE)
[![Idiomas](https://img.shields.io/badge/Idiomas-ES%20%7C%20EN-cyan.svg)](#-internacionalización-i18n)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF.svg)](https://vitejs.dev/)

🌐 **[Read in English / Leer en Inglés (README.md)](./README.md)** | 🎓 **[Guía Pedagógica del Profesor (GUIA_PROFESOR.md)](./GUIA_PROFESOR.md)** | 📚 **[English Teacher Guide (TEACHER_GUIDE.md)](./TEACHER_GUIDE.md)**

</div>

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

### 6. 💬 Módulo LLM & Tokens: Transformers y Generación de Lenguaje
- **Tokenización en Vivo (BPE)**: Visualiza el troceado de texto en subpalabras, caracteres de espacio inicial (`·`) y su mapeo al diccionario de IDs numéricos.
- **Arcos de Auto-Atención (Self-Attention)**: Pasa el ratón sobre cualquier token para ver los arcos SVG curvados que muestran a qué palabras atiende el modelo para desambiguar el significado contextual (ej. *banco* en el contexto de un *parque* frente al contexto de un *préstamo* financiero).
- **Predicción de Siguiente Token y Bucle Autorregresivo**: Explora la ruleta de probabilidades Softmax y pulsa *"Predecir Siguiente Token"* o *"Auto-Generar"* para ver al LLM escribir palabra a palabra en tiempo real.

---

### 7. 🎓 Academia & Retos Didácticos
Cuatro misiones prácticas para resolver con un clic:
1. **La Trampa de la Línea Recta (Perceptrón)**: Demuestra por qué 0 capas ocultas no pueden separar regiones concéntricas.
2. **El Poder de la No Linealidad y ReLU**: Añade capas ocultas y observa el plegado del espacio.
3. **El Monstruo del Sobreajuste (Overfitting)**: Experimenta qué ocurre al usar demasiadas neuronas con ruido y cómo la regularización L2 devuelve la capacidad de generalización.
4. **La Física de los Coches Autónomos**: Ajusta hiperparámetros para modelar la distancia de frenado cuadrática.
- **Glosario Visual**: Definiciones y analogías de la vida real para *Backpropagation*, *Gradiente Descendente*, *Learning Rate*, *Bias* y *Pesos*.

---

### 🌐 Internacionalización (i18n)
NeuroLab cuenta con un motor nativo de internacionalización en tiempo real:
- Selector en la cabecera para alternar al instante entre **Español** e **Inglés**.
- Persistencia de preferencia en `localStorage`.
- Traduce automáticamente etiquetas, controles, nombres de variables en unidades físicas y los textos didácticos de todas las vistas.

---

### 📖 Guías Docentes para Profesores
Consulta las guías pedagógicas completas del repositorio:
- **Español**: [`GUIA_PROFESOR.md`](./GUIA_PROFESOR.md)
- **Inglés**: [`TEACHER_GUIDE.md`](./TEACHER_GUIDE.md)

Incluyen origen y justificación científica de cada dataset (benchmarks de Kaggle, UCI y leyes físicas), cuál es la mejor función de activación para cada problema, teoría del ruido y sobreajuste, cómo enseñar LLMs en el aula, y un cronograma detallado para clases de 60-90 minutos.

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
- **HTML5 Canvas & SVG Dinámico**: Renderizado de alta resolución para la arquitectura de red, arcos de atención y mapa de frontera de decisión.
- **Vanilla ES6 Modules**: Motor de red neuronal propio con optimizador Adam, retropropagación vectorial y regularización L1/L2 sin dependencias pesadas.
- **Web Audio API**: Sonidos sintetizados sutiles para retroalimentación auditiva interactiva.
- **Vite**: Entorno de desarrollo ultrarrápido y empaquetador moderno.
- **CSS3 Dark Glassmorphism**: Interfaz estética cuidada con paleta neón, desenfoques y tipografía *Plus Jakarta Sans* y *JetBrains Mono*.

---

## 📄 Licencia
Este proyecto está bajo la Licencia Pública General de GNU v3.0 (GPL-3.0). Consulta el archivo [LICENSE](./LICENSE) para más información.
