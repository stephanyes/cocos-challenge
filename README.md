# Cocos Challenge - Backend

Este proyecto es la implementación del **Backend Challenge** de [Cocos Capital](https://github.com/cocos-capital/cocos-challenge/blob/main/backend-challenge.md). El objetivo es desarrollar una API que permita la gestión de portafolios de inversión, la creación de órdenes de compra/venta de activos y la consulta de datos del mercado.

## Características

### Funcionalidades Principales:
- **Portafolio de Usuario:**
  - Devuelve el valor total de la cuenta de un usuario.
  - Calcula los pesos disponibles para operar.
  - Lista los activos que posee el usuario, incluyendo:
    - Cantidad de acciones.
    - Valor total monetario de la posición.
    - Rendimiento total diario (%).

- **Búsqueda de Activos:**
  - Permite buscar activos por nombre o ticker.

- **Enviar Órdenes al Mercado:**
  - Soporte para órdenes de tipo `MARKET` y `LIMIT`.
  - Las órdenes `MARKET` se ejecutan inmediatamente.
  - Las órdenes `LIMIT` quedan pendientes hasta que se cumplan las condiciones.
  - Control de estado de órdenes: `NEW`, `FILLED`, `REJECTED`, `CANCELLED`.
  - Validación de fondos y acciones disponibles.

### Opcionales Implementados:
- **Colección de Postman/Insomnia** para probar los endpoints.
- **Contenedor Docker** para ejecutar la aplicación en cualquier entorno.
- **Scripts de automatización** para construcción y despliegue rápido.

---

## Instalación y Ejecución

### Requisitos:
- Node.js 20+ (o ejecutar usando Docker)
- Docker y Docker Compose

### Instalación Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/stephanyes/cocos-challenge.git
   cd cocos-challenge
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto y agregar las variables necesarias.

4. Ejecutar en modo desarrollo:
   ```bash
   npm run start:dev
   ```

---

### Configuración de Entorno - .env.example

Se incluye un archivo .env.example en el repositorio con las variables de entorno necesarias para ejecutar la aplicación. Copie este archivo como .env y complete los valores correspondientes.

### Ejecución con Docker

El proyecto incluye un `Dockerfile` y `docker-compose.yml` para facilitar la ejecución en contenedores.

1. Construir y levantar el contenedor:
   ```bash
   npm run docker:build
   npm run docker:up
   ```

2. Para detener el contenedor:
   ```bash
   npm run docker:down
   ```

3. Reiniciar el contenedor:
   ```bash
   npm run docker:restart
   ```

La aplicación está disponible en `http://localhost:8080` por defecto (en la imagen de docker esta disponible el puerto 3000).

---

## Pruebas

Se incluyen pruebas unitarias y funcionales para validar el comportamiento de la API.

1. Ejecutar pruebas:
   ```bash
   npm run test
   ```

2. Ejecutar pruebas con Docker:
   ```bash
   docker exec -it cocos-challenge npm run test
   ```

---

## Endpoints Principales

### 1. Portafolio de Usuario
- **GET** `/portfolio/:userId`
  - Devuelve el portafolio de un usuario específico.
  ```json
  {
      "userid": 1,
      "total": 861780,
      "pesos_disponibles": 600000,
      "positions": [
          {
              "instrumentId": 54,
              "ticker": "METR",
              "cantidad": 500,
              "marketValue": 114500,
              "totalValue": 57250000,
              "dailyReturnPercent": -1.293103448275862
          }
      ]
  }
  ```

### 2. Búsqueda de Activos
- **GET** `/instruments/ticker/:ticker`
  - Busca un activo por su ticker específico.
  ```json
  [
      {
          "id": 1,
          "ticker": "DYCA",
          "name": "Dycasa S.A.",
          "type": "ACCIONES"
      }
  ]
  ```
- **GET** `/instruments/type/:type`
  - Busca activos por tipo (ej. ACCIONES, BONOS, etc.).
  ```json
  [
      {
          "id": 66,
          "ticker": "ARS",
          "name": "PESOS",
          "type": "MONEDA"
      }
  ]
  ```

### 3. Creación de Órdenes
- **POST** `/orders`
  - Crea una nueva orden de compra/venta.
  - Ejemplo de payload:
    ```json
    {
      "userid": 1,
      "instrumentid": 31,
      "side": "BUY",
      "size": 10,
      "type": "MARKET"
    }
    ```

---

## Documentación de la API - Swagger

La API cuenta con documentación interactiva generada con Swagger.
Una vez que la aplicación esté en ejecución, acceda a **http://localhost:8080/docs** para visualizar y probar los endpoints disponibles.

```
  configurar variables SWAGGER_ENABLED y SWAGGER_PATH 
```

## Estructura del Proyecto

```
/src
  /app.module.ts
  /main.ts
  /portfolio
  /order
  /instrument
  /entities
  /market
  /user
  /__tests__
/docker-compose.yml
/Dockerfile
/package.json
```

---

## Consideraciones Finales

- El proyecto está diseñado para ser escalable y seguir principios de **arquitectura limpia**.
- Los tests están implementados con Jest.
- Se recomienda utilizar Docker para mantener consistencia entre entornos.

---

## Nice-to-have

- Implementacion de un Logger custom con pino/winston para mantener un mejor registro de lo que sucede


## Autor
**Stephanyes**  
Repositorio: [cocos-challenge](https://github.com/stephanyes/cocos-challenge)

