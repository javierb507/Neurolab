# 🎓 Guión Docente: NeuroLab
## Manual del Profesor para Clases de Redes Neuronales e Inteligencia Artificial

<div align="center">

🌐 **[Read in English / Versión en Inglés (TEACHER_GUIDE.md)](./TEACHER_GUIDE.md)** | 🏠 **[README Principal](./README.md)** | 🇪🇸 **[README en Español](./README.es.md)**

</div>

Este documento es una guía pedagógica integral para profesores, formadores y divulgadores que deseen impartir sesiones prácticas, visuales y rigurosas sobre Redes Neuronales y Modelos de Lenguaje (LLMs) utilizando **NeuroLab**.

---

## 📑 Índice de Contenidos
1. [De Dónde se han Sacado los Datasets (Benchmarks Reales)](#-parte-1-de-dónde-se-han-sacado-los-datasets)
2. [Guía de Funciones de Activación por Problema](#-parte-2-guía-de-funciones-de-activación-por-problema)
3. [Cuadro Comparativo de Activaciones Matemáticas](#-parte-3-cuadro-comparativo-de-funciones-de-activación)
4. [¿Para qué Metemos Ruido en los Datos y qué Efecto Tiene?](#-parte-4-para-qué-metemos-ruido-y-qué-efecto-tiene)
5. [Módulo LLM: Tokenización, Auto-Atención y Generación Autorregresiva](#-parte-5-módulo-llm-tokenización-auto-atención-y-generación)
6. [Estructura de Clase Recomendada (60 - 90 Minutos)](#-parte-6-estructura-de-clase-recomendada)
7. [Preguntas Frecuentes de Alumnos (FAQ Pedagógico)](#-parte-7-preguntas-frecuentes-de-alumnos-faq-pedagógico)
8. [Glosario de Notación Matemática](#-parte-8-glosario-de-notación-matemática)

---

## 📌 PARTE 1: ¿De Dónde se han Sacado los Datasets?

Para que los alumnos conecten la teoría matemática con el mundo real, los conjuntos de datos de NeuroLab **no son ruido aleatorio abstracto ni nubes de puntos sin sentido**: son **modelos generativos sintéticos calibrados a partir de datasets de referencia internacional (benchmarks de la industria y la investigación médica)** y leyes de la física:

| Caso de Uso | Origen / Benchmark de Referencia | Variables Reales y Rango | Lógica Matemática Subyacente |
| :--- | :--- | :--- | :--- |
| **1. Diagnóstico de Diabetes** | Basado en el célebre **Pima Indians Diabetes Database** (*National Institute of Diabetes and Digestive and Kidney Diseases* / Kaggle / UCI). | $X_1$: Glucosa en ayunas (70–220 mg/dL)<br>$X_2$: IMC corporal (18–42 kg/m²) | **Frontera Curva No Lineal:** $0.8x_1 + 0.6x_2 + 0.5(x_1 x_2) - 0.1$. Modela la resistencia a la insulina combinada con el sobrepeso (efecto sinérgico multiplicativo). |
| **2. Fraude en Tarjetas** | Inspirado en el benchmark **Credit Card Fraud Detection** (*ULB Machine Learning Group* / Kaggle). | $X_1$: Importe de transacción (5–2.500 €)<br>$X_2$: Distancia al domicilio (1–800 km) | **Patrón Concéntrico / Detección de Anomalías:** La inmensa mayoría de transacciones legítimas se concentran en un radio habitual; el fraude aparece como anomalías radiales lejanas o importes inusuales ($r > 0.58$). |
| **3. Coche Autónomo (Frenado)** | Basado en la **Ley Cinemática de Frenado de la Física** ($d = \frac{v^2}{2\mu g}$). | $X_1$: Distancia al obstáculo (2–100 m)<br>$X_2$: Velocidad del coche (20–150 km/h) | **Frontera Parabólica Cuadrática:** La distancia mínima de seguridad crece con el cuadrado de la velocidad ($x_1 < 0.85(x_2 + 0.2)^2 - 0.45$). |
| **4. Control de Calidad (Industria 4.0)** | Problema clásico de manufactura y el problema teórico de **Minsky & Papert (XOR Multimodal)**. | $X_1$: Tolerancia dimensional (-50 a +50 $\mu m$)<br>$X_2$: Densidad del material (75–100 %) | **Estructura tipo XOR:** Las piezas válidas se ubican en cuadrantes opuestos simétricos ($x_1 \cdot x_2 > 0.05$). Imposible de resolver con una sola neurona o frontera lineal. |
| **5. Tasación Inmobiliaria** | Inspirado en el benchmark **Boston & Ames Housing Datasets** (Regresión Continua). | $X_1$: Superficie útil (40–240 $m^2$)<br>$X_2$: Conectividad urbana (1–10 pts) | **Superficie Continua 3D:** Genera un valor continuo normalizado $[0, 1]$ que escala a precios de 80.000 € a 530.000 €. |

> [!NOTE]
> **¿Por qué generar sintéticamente a partir de estos benchmarks en lugar de cargar un CSV estático de 10.000 filas?**
> 1. **Control de Ruido en Directo**: Permite al profesor mover el slider de ruido del 0% al 40% en clase para ilustrar el sobreajuste (*overfitting*).
> 2. **Velocidad a 60 FPS en el Navegador**: El motor calcula la frontera continua y el backpropagation sin latencia de red ni servidores externos.
> 3. **Interacción "Custom Probe" (Sonda Personalizada)**: El alumno puede hacer clic en cualquier coordenada del espacio y la red responde en milisegundos con los valores desnormalizados a unidades clínicas o financieras.

---

## 🎯 PARTE 2: Guía de Funciones de Activación por Problema

### Regla Fundamental de Oro para Explicar en Clase:
* **Capas Ocultas**: Necesitan **no linealidad**. Determinan *cómo se pliega y deforma el espacio* para aislar las clases. Sin funciones de activación no lineales, mil capas ocultas equivalen matemáticamente a una sola multiplicación matricial lineal ($W_3(W_2(W_1 x)) = W_{eq} x$).
* **Capa de Salida**: Depende del **tipo de problema**:
  * Para *Clasificación Binaria* (Diabetes, Fraude, Coche, Calidad) $\to$ **Sigmoide** (salida acotada entre $0$ y $1$, interpretable como probabilidad porcentual).
  * Para *Regresión Continua* (Tasación de vivienda) $\to$ **Lineal** o Sigmoide reescalada.
  * Para *Clasificación Multiclase o Siguiente Token en LLMs* $\to$ **Softmax** (distribución normalizada cuya suma total es $100\%$).

---

### Caso 1: Diagnóstico de Diabetes (Frontera suavemente curva)
* **Mejor Activación:** **`ReLU`** (o `Tanh`).
* **Arquitectura recomendada:** 1 o 2 capas ocultas con `[4, 2]` neuronas. Learning Rate: `0.03`.
* **Por qué es la mejor:**
  * La zona de riesgo es monótona: a más glucosa y más IMC, mayor riesgo. `ReLU` converge en menos de 25 épocas con precisión $>97\%$.
* **Qué pasa si usan `Lineal`:**
  * La red traza una línea recta fija y se equivoca en la zona de pacientes con IMC moderado pero glucosa alta. Muestra al alumno que sin función no lineal, la red no puede capturar la sinergia metabólica.
* **Pregunta para los alumnos:** *"¿Por qué una persona con glucosa de 130 mg/dL y un IMC bajo no es diabética, pero si su IMC sube a 32 sí lo es?"* $\to$ Ver cómo la neurona oculta multiplica ambas variables.

---

### Caso 2: Ciberseguridad & Fraude en Tarjetas (Frontera concéntrica / circular)
* **Mejor Activación:** **`Tanh`** o **`ReLU`** (con al menos 2 capas ocultas, ej. `[6, 4]`).
* **Por qué es la mejor:**
  * Para encerrar un círculo o isla central de compras normales, la red necesita combinar varios hiperplanos que "corten" el espacio por todos los costados.
  * `Tanh` destaca aquí porque tiene salida centrada en cero $[-1, 1]$ con gradientes suaves en ambas direcciones, curvando la frontera con elegancia.
  * Si se usa `ReLU`, la red necesita 6 u 8 neuronas para crear un polígono cerrado (como un octógono) que rodee la zona legítima.
* **Qué pasa si usan 0 capas ocultas (Perceptrón simple):**
  * **Fracaso total (50% de error):** Una línea recta solo puede cortar el círculo a la mitad; la mitad de los fraudes se clasificarán como compras legítimas. Este es el momento cumbre para explicar el hito histórico del libro de Minsky & Papert (1969).

---

### Caso 3: Coche Autónomo (Frenado Parabólico Cuadrático)
* **Mejor Activación:** **`ReLU`** o **`Leaky ReLU`**.
* **Arquitectura recomendada:** `[4, 2]` neuronas. Learning Rate: `0.03`.
* **Por qué es la mejor:**
  * La ley física de frenado ($d \propto v^2$) es asimétrica: a baja velocidad la distancia necesaria es corta, pero a alta velocidad se dispara rápidamente hacia arriba.
  * `ReLU` modela tramos lineales por partes (*piecewise linear*). Con 4 neuronas reproduce la parábola física con precisión $>98\%$.
* **Consejo didáctico:** Activar en la ingeniería de características el término **$X_2^2$** (velocidad al cuadrado) y demostrar a la clase cómo la red converge en solo 5 épocas, demostrando el enorme valor del *Feature Engineering*.

---

### Caso 4: Control de Calidad Láser (Problema tipo XOR)
* **Mejor Activación:** **`Tanh`** o **`Leaky ReLU`**.
* **Arquitectura recomendada:** `[4, 4]` neuronas. Learning Rate: `0.05`.
* **Por qué es la mejor:**
  * En un problema tipo XOR, los datos válidos están en dos cuadrantes opuestos (superior-derecho e inferior-izquierdo).
  * `Tanh` maneja perfectamente la simetría de signos positivos y negativos.
  * Si se usa `ReLU` con una tasa de aprendizaje agresiva ($\alpha = 0.8$), los alumnos verán el fenómeno de la **Neurona Muerta (Dying ReLU)**: neuronas cuyo gradiente se vuelve cero permanente y la red se bloquea. Ahí se introduce **`Leaky ReLU`** como la solución moderna de la industria.

---

### Caso 5: Tasación de Vivienda (Regresión Continua)
* **Mejor Activación:** **`ReLU`** en capas ocultas y **`Lineal`** en la salida.
* **Por qué es la mejor:**
  * En regresión no queremos una decisión discreta de "sí o no", sino una estimación suave de una magnitud económica.
  * Una activación lineal en la capa de salida permite extrapolar valores sin toparse con asíntotas en 0 o 1.

---

## 📊 PARTE 3: Cuadro Comparativo de Funciones de Activación

| Función | Fórmula $f(z)$ | Rango | Ventajas Clave | Desventajas / Riesgos | Cuándo Recomendarla |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ReLU** | $\max(0, z)$ | $[0, \infty)$ | Cálculo ultrarrápido; gradiente constante $1$ para $z>0$ (evita que el gradiente desaparezca). | Puede sufrir de "neuronas muertas" si caen en zona negativa. | **Opción por defecto universal** para capas ocultas. |
| **Leaky ReLU** | $z > 0 ? z : 0.01z$ | $(-\infty, \infty)$ | Soluciona la muerte de neuronas manteniendo un pequeño flujo cuando $z<0$. | Introduce un hiperparámetro adicional ($\alpha \approx 0.01$). | Redes profundas o cuando `ReLU` se estanca. |
| **Tanh** | $\frac{e^z - e^{-z}}{e^z + e^{-z}}$ | $(-1, 1)$ | Centrada en cero; excelente para datos simétricos y círculos concéntricos. | Saturación en extremos (gradiente cercano a cero con $|z|>3$). | Problemas con simetrías, anomalías circulares y RNNs. |
| **Sigmoide** | $\frac{1}{1 + e^{-z}}$ | $(0, 1)$ | Interpretación probabilística directa ($0\%$ a $100\%$). | Desvanecimiento de gradiente severo si se usa en capas profundas. | **Capa de salida** en clasificación binaria. |
| **Lineal** | $z$ | $(-\infty, \infty)$ | Sin alteración; preserva magnitudes proporcionales. | No introduce no linealidad (acumular capas lineales equivale a 1 sola capa). | **Capa de salida** en problemas de regresión continua. |
| **Softmax** | $\frac{e^{z_i}}{\sum e^{z_j}}$ | $(0, 1)$ tal que $\sum = 1$ | Convierte vectores arbitrarios de logits en distribuciones de probabilidad multiclase. | Computacionalmente más costosa con vocabularios gigantes. | **Capa de salida de LLMs y Transformers** para elegir el siguiente token. |

---

## 🎲 PARTE 4: ¿Para qué Metemos Ruido y qué Efecto Tiene?

El control de **Ruido (Noise)** del 0% al 50% es una de las herramientas didácticas más potentes de NeuroLab para explicar la diferencia entre **memorizar** y **generalizar**:

```
        DATOS REALES CON RUIDO
   ▲
X2 │   O      O (erróneo)
   │     O  O     X
   │   O   O   X    X
   │         X   X    X
   └────────────────────────► X1
     Zona O   │  Zona X
```

### 1. ¿Por qué existen datos ruidosos en la realidad?
En el mundo real no existen fronteras matemáticas quirúrgicas:
* **Tolerancia y calibración de sensores:** Un glucómetro tiene un margen de error del $\pm 5\%$.
* **Variabilidad biológica o humana:** Un paciente puede tener glucosa alta circunstancial por estrés sin ser diabético crónico.
* **Errores de etiquetado humano:** En transacciones bancarias, un usuario puede reportar erróneamente una compra que sí hizo su familiar.

### 2. El peligro del Ruido 0% (La trampa del laboratorio)
Si entrenamos con ruido $0\%$:
* Los datos están perfectamente separados por una ecuación matemática limpia.
* Los alumnos pensarán falsamente que una red perfecta debe tener $100\%$ de precisión y pérdida $0.000$.
* No se aprecia la necesidad de técnicas como la **regularización** ni la separación entre **Train y Test**.

### 3. Efecto del Ruido Moderado (5% a 15%) — Regularizador Natural
* Obliga a la red a encontrar la **tendencia de fondo** (*underlying pattern*) en vez de obsesionarse con puntos individuales.
* Enseña el concepto de **Error de Bayes (Límite Bayesiano)**: cuando los puntos de dos clases se solapan físicamente en el espacio, es matemáticamente imposible alcanzar el 100% de acierto. La mejor red del mundo solo podrá alcanzar, por ejemplo, un 94%.

### 4. Efecto del Ruido Alto (>30%) — Demostración de Overfitting
Para demostrar el sobreajuste en vivo:
1. Subir el slider de ruido al **35%**.
2. Diseñar una red sobredimensionada: 3 capas ocultas con `[8, 8, 8]` neuronas.
3. Desactivar regularización (Regularization: None).
4. Dar a entrenar:
   * **Pérdida de Entrenamiento (Train Loss):** Sigue bajando (la red crea "islas" y tentáculos deformes para rodear cada punto rebelde).
   * **Pérdida de Test (Test Loss):** Comienza a subir bruscamente tras unas épocas.
5. **Solución en directo:** Activar **Regularización L2** con tasa $0.01$. La frontera tensa sus resortes matemáticos, elimina las islas absurdas y el Test Loss desciende inmediatamente.

---

## 🤖 PARTE 5: Módulo LLM: Tokenización, Auto-Atención y Generación

La pestaña **"Tokens & LLM"** permite explicar a los alumnos la tecnología detrás de ChatGPT, Claude o Gemini a través de 3 etapas animadas:

### 1. Tokenización y Asignación de IDs (BPE)
Los modelos de lenguaje **no leen letras ni palabras enteras**, sino subpalabras numéricas:

```
Texto Humano:      "El gato bebió leche tibia plácidamente"
                         │
                 Algoritmo BPE
                         ▼
Tokens:        [ "El", " gato", " bebi", "ó", " leche", " tibia", " plácida", "mente" ]
                         │
               Diccionario (Vocabulario)
                         ▼
Token IDs:     [  412,   5931,   18492, 1024,   1420,    18991,    24102,     4891 ]
```

#### Aspectos Clave para Señalar en Clase:
* **El espacio es parte del token**: Observa los chips con el símbolo `·` (ej. `·gato` vs `gato`). Para el LLM son números completamente distintos.
* **Ahorro de vocabulario**: Si el modelo tuviera que guardar cada palabra conjugada en español necesitaría millones de entradas. Con subpalabras (*Byte-Pair Encoding*), combinando la raíz `·plácida` y el sufijo `mente` puede construir miles de adverbios con solo decenas de tokens base.
* **Matemáticas puras**: Para la red neuronal, la entrada es solo un vector de enteros: $[412, 5931, \dots]$.

---

### 2. Mecanismo de Auto-Atención (*Self-Attention*)
¿Cómo sabe el modelo qué significa una palabra ambigua? **Calculando pesos de atención respecto a todas las demás palabras de la frase**.

```
              ┌───────── Atiende a: "parque" (banco = banco de sentarse)
              │
  "El banco del parque estaba mojado"
  "Fui al banco a pedir un préstamo"
              │
              └───────── Atiende a: "préstamo" (banco = entidad financiera)
```

#### Demostración Interactiva en Clase:
1. Seleccionar el preset **'El significado de "Banco" (Contexto Parque)'**.
2. Pasar el ratón sobre la palabra `banco`: el arco cian brilla conectándose con `parque`. El cuadro contextual explica que el Transformer le asigna una semántica de **asiento o mobiliario urbano**.
3. Cambiar al preset **'El significado de "Banco" (Contexto Financiero)'**.
4. Pasar el ratón sobre `banco`: el arco cian se reorienta intensamente hacia `préstamo`. El Transformer actualiza la representación vectorial de `banco` como **entidad de crédito**.

#### La Fórmula Matemática de la Atención (Scaled Dot-Product Attention):
$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V$$
* **Query ($Q$):** Lo que cada palabra está buscando ("¿quién me aclara mi significado?").
* **Key ($K$):** La etiqueta o propuesta de cada palabra ("yo hablo de un parque", "yo hablo de un préstamo").
* **Value ($V$):** La información semántica que se transfiere cuando $Q$ y $K$ coinciden.

---

### 3. Predicción del Siguiente Token (Softmax) y el Bucle Autorregresivo
Un LLM no planifica un texto completo de antemano: **predice el siguiente token una y otra vez de forma autorregresiva**.

```
Frase actual: "El gato bebió"
       │
   Transformer
       │
     Logits  ──►  Softmax  ──► Distribución de Probabilidad:
                                 • " leche"     : 64%  ███████████████
                                 • " agua"      : 24%  █████
                                 • " despacio"  :  8%  █
                                 • " gasolina"  : 0.1% 
       │
   Muestreo (Elige " leche")
       │
   Nueva Frase: "El gato bebió leche" ──► Se reinicia el bucle (Paso 1)
```

#### Botones para la Dinámica en Clase:
* **"Predecir Siguiente Token"**: Realiza un paso atómico. Muestra cómo se selecciona la barra de mayor porcentaje, se concatena al texto con un efecto de resplandor (*glow*) y se actualizan al vuelo los arcos de atención.
* **"Auto-Generar"**: Activa el bucle automático a velocidad pedagógica (1.2 segundos por token) para ver cómo el texto fluye orgánicamente.

---

## ⏱️ PARTE 6: Estructura de Clase Recomendada

### Sesión de 60 Minutos: "De la Neurona al Transformer"

| Minutos | Actividad / Módulo | Objetivos de Aprendizaje |
| :---: | :--- | :--- |
| **00 – 10** | **El Microscopio Neuronal** *(Pestaña MLP)* | Abrir el caso Diabetes. Clic en una neurona oculta. Analizar la fórmula $z = \sum w_i x_i + b$, los pesos individuales y el sesgo (*bias*). |
| **10 – 25** | **El Límite del Perceptrón Simple** *(Misión 1 de la Academia)* | Cargar el caso de Fraude con 0 capas ocultas. Demostrar empíricamente por qué una recta no puede separar un círculo concéntrico. |
| **25 – 40** | **No Linealidad y Feature Engineering** *(Pestaña MLP)* | Añadir 1 capa con 4 neuronas `ReLU`. Observar cómo se dobla la frontera. Activar el término $X_2^2$ en el Coche Autónomo para ilustrar ingeniería de características. |
| **40 – 50** | **Overfitting y Ruido** *(Pestaña MLP)* | Subir ruido a 35%, aumentar neuronas a 8x8. Ver la divergencia entre Train Loss y Test Loss. Activar regularización L2 para restaurar la generalización. |
| **50 – 60** | **LLMs y Tokenización** *(Pestaña Tokens & LLM)* | Escribir frases de los alumnos en el tokenizador. Analizar los IDs numéricos y la auto-atención en la desambiguación de "banco". Ejecutar la auto-generación. |

---

## ❓ PARTE 7: Preguntas Frecuentes de Alumnos (FAQ Pedagógico)

### P1: "¿Por qué la pérdida nunca llega a 0.000?"
* **Respuesta para el alumno:** En cualquier problema con ruido o datos reales, hay solapamiento. Llegar a 0 en datos reales significa casi con total certeza que el modelo ha memorizado los datos de entrenamiento (*overfitting*) y fallará en producción.

### P2: "¿Por qué no ponemos siempre 10 capas y 100 neuronas por capa?"
* **Respuesta para el alumno:**
  1. **Coste computacional y lentitud.**
  2. **Sobreajuste:** Un modelo con demasiada capacidad memoriza el ruido en vez de aprender las leyes físicas o médicas de fondo.
  3. **Problema del desvanecimiento del gradiente:** En redes demasiado profundas sin conexiones residuales, las correcciones hacia atrás se diluyen.

### P3: "¿Cómo sabe un LLM cuándo terminar de responder una frase?"
* **Respuesta para el alumno:** El vocabulario del modelo incluye un token especial de parada llamado `<|endoftext|>` o `<EOS>` (*End Of Sequence*). Cuando en el paso Softmax este token gana la máxima probabilidad, el bucle autorregresivo se detiene automáticamente.

### P4: "¿Qué es la Temperatura en un LLM?"
* **Respuesta para el alumno:** Es un divisor que se aplica a los logits antes de calcular la Softmax ($z_i / T$).
  * **Temperatura 0 (Greedy):** Elige siempre con frialdad el token con 1% más alto (respuestas deterministas y repetitivas).
  * **Temperatura 0.7 - 1.0:** Suaviza las diferencias de probabilidad, permitiendo que tokens con menor probabilidad pero válidos sean seleccionados (creatividad y fluidez natural).
  * **Temperatura > 2.0:** La distribución se vuelve casi plana y uniforme (el modelo empieza a desvariar y decir cosas sin sentido).

---

## 📐 PARTE 8: Glosario de Notación Matemática

* $x_i$: Variable de entrada (*feature*) normalizada.
* $w_i$: Peso sináptico (*weight*). Controla la fuerza y el signo de la conexión.
* $b$: Sesgo (*bias*). Umbral que desplaza la función de activación horizontalmente.
* $z = \sum w_i a_i + b$: Combinación lineal pre-activación (*logit*).
* $a = f(z)$: Activación post-función no lineal.
* $\alpha$: Tasa de aprendizaje (*learning rate*). Tamaño del paso en el descenso de gradiente.
* $\lambda$: Coeficiente de regularización L1 / L2 (*weight decay*).
* $\mathcal{L}$: Función de pérdida (*Loss function*), ej. Entropía Cruzada o Error Cuadrático Medio (MSE).
* $h_t$: Estado oculto (*hidden state*) en redes recurrentes (vector de memoria secuencial).
* $Q, K, V$: Vectores de Consulta (*Query*), Clave (*Key*) y Valor (*Value*) en mecanismos de atención Transformer.
