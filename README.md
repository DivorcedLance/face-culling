# Face-Culling Demo

Este proyecto es una **demostración de Face-Culling** creada con **React Three Fiber** y **Three.js**. La aplicación permite visualizar cómo se aplican técnicas de face-culling, donde se renderizan solo las caras visibles de un objeto 3D en función de la orientación relativa entre las caras y la cámara.

## Funcionalidades

- **Face-Culling Dinámico:** Permite activar o desactivar la ocultación de caras frontales y traseras, mostrando solo las visibles según la posición de la cámara.
- **Controles de Cámara Interactivos:** Incluye controles de órbita que permiten rotar y acercar el objeto, visualizando el efecto de face-culling desde diferentes ángulos.
- **Modo de Visualización Configurable:** Opción para mostrar ambas caras o solo las visibles, de acuerdo con las preferencias de renderización.

## Requisitos

Para ejecutar el proyecto, necesitarás tener **Node.js** y **npm** instalados en tu sistema.

### Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tu-usuario/face-culling-demo.git
   cd face-culling-demo
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Ejecuta la aplicación en modo de desarrollo:

   ```bash
   npm start
   ```

Abre `http://localhost:3000` en tu navegador para ver la aplicación en funcionamiento.

## Contexto Matemático

El algoritmo de face-culling se basa en principios de geometría vectorial y usa operaciones vectoriales para decidir la visibilidad de cada cara. A continuación, se explica el cálculo matemático detrás del face-culling.

### 1. Cálculo del Vector Normal

Cada cara del objeto 3D tiene un **vector normal** $\vec{n}$, que es perpendicular a la superficie de la cara. Este vector se calcula usando los vértices de la cara ($\vec{v_0}$, $\vec{v_1}$, $\vec{v_2}$) mediante el producto cruzado entre dos de sus aristas:

$$
\vec{n} = (\vec{v_1} - \vec{v_0}) \times (\vec{v_2} - \vec{v_0})
$$

Este vector normal $\vec{n}$ nos da la orientación de la cara en el espacio 3D.

### 2. Cálculo del Vector de Visión

El **vector de visión** $\vec{v}$ se calcula como la dirección desde la posición de la cámara $\vec{c}$ hacia un vértice de la cara, en este caso, el vértice $\vec{v_0}$:

$$
\vec{v} = \vec{v_0} - \vec{c}
$$

Este vector de visión $\vec{v}$ es esencial para determinar si la cara está orientada hacia o en contra de la cámara.

### 3. Producto Punto y Face-Culling

Para decidir si una cara es visible desde la cámara, calculamos el **producto punto** entre el vector normal $\vec{n}$ y el vector de visión $\vec{v}$:

$$
\text{dotProduct} = \vec{n} \cdot \vec{v}
$$

- Si el producto punto es **positivo** ($\text{dotProduct} > 0$), la cara está orientada hacia la cámara y se considera una **cara frontal**.
- Si el producto punto es **negativo** ($\text{dotProduct} < 0$), la cara está orientada en sentido opuesto y se considera una **cara trasera**.

En el código, este cálculo permite activar o desactivar la renderización de caras frontales o traseras mediante configuraciones de **front-culling** y **back-culling**.