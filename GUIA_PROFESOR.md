# 🎓 Guión Docente: NeuroLab
## Manual del Profesor para Clases de Redes Neuronales e Inteligencia Artificial

Este documento es una guía pedagógica para profesores, divulgadores o instructores que deseen impartir una sesión práctica y visual sobre Redes Neuronales utilizando **NeuroLab**.

---

## 📌 PARTE 1: ¿De dónde se han sacado los Datasets?

Para que los alumnos conecten la teoría matemática con el mundo real, los conjuntos de datos de NeuroLab **no son ruido abstracto**: son **modelos generativos sintéticos calibrados a partir de datasets de referencia internacional (benchmarks de la industria y la investigación médica)** y leyes físicas:

| Caso de Uso | Origen / Benchmark de Referencia | Variables Reales y Rango | Lógica Matemática Subyacente |
| :--- | :--- | :--- | :--- |
| **1. Diagnóstico de Diabetes** | Basado en el célebre **Pima Indians Diabetes Database** (*National Institute of Diabetes and Digestive and Kidney Diseases* / Kaggle / UCI). | $X_1$: Glucosa en ayunas (70–220 mg/dL)<br>$X_2$: IMC corporal (18–42 kg/m²) | **Frontera Curva No Lineal:** $0.8x_1 + 0.6x_2 + 0.5(x_1 x_2) - 0.1$. Modela la resistencia a la insulina combinada con el sobrepeso (efecto sinérgico). |
| **2. Fraude en Tarjetas** | Inspirado en el benchmark **Credit Card Fraud Detection** (*ULB Machine Learning Group* / Kaggle). | $X_1$: Importe de transacción (5–2.500 €)<br>$X_2$: Distancia al domicilio (1–800 km) | **Patrón Concéntrico / Detección de Anomalías:** La mayoría de transacciones legítimas se concentran en el centro; el fraude aparece como anomalías radiales lejanas o esquinas inusuales ($r > 0.58$). |
| **3. Coche Autónomo (Frenado)** | Basado en la **Ley Cinemática de Frenado de la Física** ($d = \frac{v^2}{2\mu g}$). | $X_1$: Distancia al obstáculo (2–100 m)<br>$X_2$: Velocidad del coche (20–150 km/h) | **Frontera Parabólica Cuadrática:** La distancia mínima para evitar la colisión crece con el cuadrado de la velocidad ($x_1 < 0.85(x_2 + 0.2)^2 - 0.45$). |
| **4. Control de Calidad (Industria 4.0)** | Problema clásico de manufactura y el problema teórico de **Minsky & Papert (XOR Multimodal)**. | $X_1$: Tolerancia dimensional (-50 a +50 $\mu m$)<br>$X_2$: Densidad del material (75–100 %) | **Estructura tipo XOR:** Las piezas válidas se ubican en cuadrantes simétricos ($x_1 \cdot x_2 > 0.05$). Imposible de resolver con una sola neurona. |
| **5. Tasación Inmobiliaria** | Inspirado en el benchmark **Boston & Ames Housing Datasets** (Regresión). | $X_1$: Superficie útil (40–240 $m^2$)<br>$X_2$: Conectividad urbana (1–10 pts) | **Superficie Continua 3D:** Genera un valor continuo normalizado $[0, 1]$ que escala a precios de 80.000 € a 530.000 €. |

> [!NOTE]
> **¿Por qué generar sintéticamente a partir de estos benchmarks en lugar de cargar un CSV estático de 10.000 filas?**
> 1. **Control de Ruido en Directo**: Permite al profesor mover el slider de ruido del 0% al 40% en clase para ilustrar el sobreajuste (*overfitting*).
> 2. **Velocidad a 60 FPS en el Navegador**: El motor calcula la frontera continua y el backpropagation sin latencia de red.
> 3. **Interacción "Custom Probe"**: El alumno puede hacer clic en cualquier coordenada del espacio y la red responde en milisegundos con los valores desnormalizados a unidades clínicas o financieras.

---

## 🎯 PARTE 2: Guía de Funciones de Activación por Problema

### Regla Fundamental de Oro para Explicar en Clase:
* **Capas Ocultas**: Necesitan **no linealidad**. Determinan *cómo se pliega y deforma el espacio* para aislar las clases.
* **Capa de Salida**: Depende del **tipo de problema**:
  * Para *Clasificación Binaria* (Diabetes, Fraude, Coche, Calidad) $\to$ **Sigmoide** (salida entre $0$ y $1$, interpretable como probabilidad porcentual).
  * Para *Regresión Continua* (Tasación de vivienda) $\to$ **Lineal** o Sigmoide reescalada.

---

### Caso 1: Diagnóstico de Diabetes (Frontera suavemente curva)
* **Mejor Activación:** **`ReLU`** (o `Tanh`).
* **Arquitectura recomendada:** 1 o 2 capas ocultas con `[4, 2]` neuronas. Learning Rate: `0.03`.
* **Por qué es la mejor:**
  * La zona de riesgo es monótona: a más glucosa y más IMC, mayor riesgo. `ReLU` converge en menos de 25 épocas con precisión $>97\%$.
* **Qué pasa si usan `Lineal`:**
  * La red traza una línea recta fija y se equivoca en la zona de pacientes con IMC moderado pero glucosa alta. Muestra al alumno que sin función no lineal, mil capas ocultas equivalen matemáticamente a una sola matriz lineal.
* **Pregunta para los alumnos:** *"¿Por qué una persona con glucosa de 130 mg/dL y un IMC bajo no es diabética, pero si su IMC sube a 32 sí lo es?"* $\to$ Ver cómo la red aprende esa interacción.

---

### Caso 2: Ciberseguridad & Fraude en Tarjetas (Frontera concéntrica / circular)
* **Mejor Activación:** **`Tanh`** o **`ReLU`** (con al menos 2 capas ocultas, ej. `[6, 4]`).
* **Por qué es la mejor:**
  * Para encerrar un círculo o isla central de compras normales, la red necesita combinar varios hiperplanos que "corten" el espacio por todos los costados.
  * `Tanh` destaca aquí porque tiene salida centrada en cero $[-1, 1]$ con gradientes suaves en ambas direcciones, curvando la frontera con elegancia.
  * Si se usa `ReLU`, la red necesita 6 u 8 neuronas para crear un polígono cerrado (como un octógono) que rodee la zona legítima.
* **Qué pasa si usan 0 capas ocultas (Perceptrón simple):**
  * **Fracaso total (50% de error):** Una línea recta solo puede cortar el círculo a la mitad; la mitad de los fraudes se clasificarán como compras legítimas. Este es el momento cumbre para explicar el libro histórico de Minsky & Papert (1969).

---

### Caso 3: Coche Autónomo (Frenado Parabólico Cuadrático)
* **Mejor Activación:** **`ReLU`** o **`Leaky ReLU`**.
* **Arquitectura recomendada:** `[4, 2]` neuronas. Learning Rate: `0.03`.
* **Por qué es la mejor:**
  * La ley física de frenado ($d \propto v^2$) es asimétrica: a baja velocidad la distancia es casi nula, pero a alta velocidad se dispara rápidamente hacia arriba.
  * `ReLU` modela tramos lineales por partes (*piecewise linear*). Con 4 neuronas reproduce la parábola física con precisión $>98\%$.
* **Consejo didáctico:** Activar en la ingeniería de características el término **$X_2^2$** (velocidad al cuadrado) y demostrar a la clase cómo la red converge en solo 5 épocas, demostrando el poder del *Feature Engineering*.

---

### Caso 4: Control de Calidad Láser (Problema tipo XOR)
* **Mejor Activación:** **`Tanh`** o **`Leaky ReLU`**.
* **Arquitectura recomendada:** `[4, 4]` neuronas. Learning Rate: `0.05`.
* **Por qué es la mejor:**
  * En un problema tipo XOR, los datos buenos están en dos cuadrantes opuestos (superior-derecho e inferior-izquierdo).
  * `Tanh` maneja perfectamente la simetría de signos positivos y negativos.
  * Si se usa `ReLU` con una tasa de aprendizaje agresiva ($\alpha = 0.8$), los alumnos verán el fenómeno de la **Neurona Muerta (Dying ReLU)**: neuronas cuyo gradiente se vuelve cero permanente y la red se bloquea. Ahí se introduce **`Leaky ReLU`** como la solución moderna.

---

### Caso 5: Tasación de Vivienda (Regresión Continua)
* **Mejor Activación:** **`ReLU`** en capas ocultas y **`Lineal`** en la salida.
* **Por qué es la mejor:**
  * En regresión no queremos una decisión de "sí o no", sino una estimación suave de una magnitud económica.
  * Una activación lineal en la capa de salida permite extrapolar valores sin saturar en 0 o 1.

---

## 📊 PARTE 3: Cuadro Comparativo de Funciones de Activación

| Función | Fórmula $f(z)$ | Rango | Ventajas Clave | Desventajas / Riesgos | Cuándo Recomendarla |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ReLU** | $\max(0, z)$ | $[0, \infty)$ | Cálculo ultrarrápido; gradiente constante $1$ para $z>0$ (evita que el gradiente desaparezca). | Puede sufrir de "neuronas muertas" si caen en zona negativa. | **Opción por defecto universal** para capas ocultas. |
| **Leaky ReLU** | $z > 0 ? z : 0.01z$ | $(-\infty, \infty)$ | Soluciona la muerte de neuronas manteniendo un pequeño flujo cuando $z<0$. | Introduce un hiperparámetro adicional. | Redes profundas o cuando `ReLU` se estanca. |
| **Tanh** | $\frac{e^z - e^{-z}}{e^z + e^{-z}}$ | $(-1, 1)$ | Centrada en cero; excelente para datos simétricos y círculos concéntricos. | Saturación en extremos (gradiente cercano a cero con $|z|>3$). | Problemas con simetrías, anomalías circulares y RNNs. |
| **Sigmoide** | $\frac{1}{1 + e^{-z}}$ | $(0, 1)$ | Interpretación probabilística directa ($0\%$ a $100\%$). | Desvanecimiento de gradiente severo si se usa en capas profundas. | **Capa de salida** en clasificación binaria. |
| **Lineal** | $z$ | $(-\infty, \infty)$ | Sin alteración; preserva magnitudes proporcionales. | No introduce no linealidad (acumular capas lineales equivale a 1 sola capa). | **Capa de salida** en problemas de regresión. |

---

## ⏱️ PARTE 4: Estructura de Clase Recomendada (60 Minutos)

### Minuto 00 – 10: ¿Qué es una Neurona? (El Microscopio Neuronal)
1. Abrir NeuroLab en el caso de **Diabetes**.
2. Pausar el entrenamiento y hacer clic en una neurona oculta.
3. Mostrar la fórmula $z = \sum w_i x_i + b$ y cómo la tabla desglosa cada peso numérico en vivo.
4. Mostrar el **Sesgo (Bias)** como el umbral personal de activación.

### Minuto 10 – 25: El Límite del Perceptrón (Misión 1 de la Academia)
1. Ir a la pestaña **Academia & Retos** y cargar la **Misión 1** (Fraude bancario con 0 capas ocultas).
2. Dar a *Entrenar*: los alumnos verán que la red se queda en ~50% de acierto trazando una línea recta estúpida.
3. Explicar por qué la inteligencia artificial se estancó en los años 70 hasta que se descubrió el entrenamiento multicapa.

### Minuto 25 – 40: La Magia de la Capa Oculta y ReLU (Misión 2)
1. Añadir 1 capa con 4 neuronas y activar **`ReLU`**.
2. Dar a *Entrenar*: en 30 épocas la red dobla la frontera y abraza el círculo con $>95\%$ de precisión.
3. Activar el botón *"Paso a Paso"* para ver cómo los pesos cambian época a época mediante el optimizador Adam.
4. Hacer clic en el mapa para colocar una **Sonda Personalizada** (Custom Probe) y comprobar qué predice para un paciente ficticio.

### Minuto 40 – 50: El Monstruo del Sobreajuste (Overfitting) y Regularización
1. Subir el Ruido al $30\%$ y añadir 3 capas con 8 neuronas cada una.
2. Observar cómo la red empieza a crear "islas" para memorizar puntos erróneos (Train Loss baja pero Test Loss sube).
3. Activar **Regularización L2 ($\lambda = 0.01$)** y ver cómo la frontera se suaviza de inmediato y el Test Loss mejora.

### Minuto 50 – 60: Expansión a CNN y RNN / Transformers
1. Pasar a la pestaña **Visión CNN**: mostrar el escaneo del Kernel 3×3 (Sobel), el feature map y cómo el Max Pooling reduce la imagen conservando el rasgo.
2. Pasar a la pestaña **Secuencias RNN**: reproducir la frase clínica y ver el medidor de memoria interna $h_t$ cambiando palabra por palabra.
