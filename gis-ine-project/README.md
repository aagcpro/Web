# Proyecto GIS de Secciones Electorales del INE

Este es un proyecto de demostración para visualizar las secciones electorales del INE en México sobre un mapa de Google Maps y permitir a los usuarios encontrar su sección electoral a partir de su dirección.

## Estructura del Proyecto

-   `/backend`: Contiene el servidor Node.js/Express que sirve los datos geoespaciales desde una base de datos PostgreSQL/PostGIS.
-   `/frontend`: Contiene la aplicación web (HTML, CSS, JS) que consume los datos del backend y los muestra en un mapa de Google Maps.
-   `/data`: Contiene instrucciones sobre cómo obtener e importar los datos geoespaciales necesarios.

## Requisitos

-   Node.js y npm
-   PostgreSQL con la extensión PostGIS
-   Una clave de API de Google Maps

## Pasos para la Puesta en Marcha

### 1. Backend

1.  **Navega al directorio del backend:**
    ```bash
    cd backend
    ```
2.  **Instala las dependencias:**
    ```bash
    npm install
    ```
3.  **Configura la base de datos:**
    -   Crea una base de datos en PostgreSQL (ej. `gis_ine`).
    -   Activa la extensión PostGIS en tu base de datos: `CREATE EXTENSION postgis;`
    -   Sigue las instrucciones en `data/README.md` para descargar e importar los datos de las secciones electorales.
    -   Actualiza la configuración de la base de datos en `backend/config/db.js` con tus credenciales.
4.  **Inicia el servidor:**
    ```bash
    npm start
    ```
    El servidor se ejecutará en `http://localhost:3000`.

### 2. Frontend

1.  **Obtén una clave de API de Google Maps:**
    -   Ve a la [Consola de Google Cloud](https://console.cloud.google.com/).
    -   Crea un proyecto y habilita la "Maps JavaScript API" y la "Geocoding API".
    -   Crea una credencial de tipo "Clave de API".
2.  **Configura la clave de API:**
    -   Abre el archivo `frontend/index.html`.
    -   Busca la línea que contiene `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY_DE_GOOGLE_MAPS&callback=initMap`.
    -   Reemplaza `TU_API_KEY_DE_GOOGLE_MAPS` con tu clave de API real.
3.  **Abre el frontend:**
    -   Abre el archivo `frontend/index.html` en tu navegador web. Puedes hacerlo directamente desde el explorador de archivos o usando una extensión de servidor en vivo en tu editor de código.

## Cómo Funciona

1.  El frontend carga el mapa de Google Maps.
2.  A través de `js/map.js`, solicita al backend (`http://localhost:3000/api/secciones`) la lista completa de secciones electorales en formato GeoJSON.
3.  El backend consulta la base de datos PostGIS, convierte las geometrías a GeoJSON y las devuelve.
4.  El frontend dibuja todas las secciones en el mapa.
5.  Cuando un usuario introduce una dirección y hace clic en "Buscar", el frontend usa la API de Geocodificación de Google para obtener las coordenadas (latitud, longitud) de esa dirección.
6.  Con las coordenadas, el frontend hace una nueva petición al backend (`/api/secciones/ubicacion?lat=...&lng=...`).
7.  El backend usa la función `ST_Contains` de PostGIS para encontrar qué polígono de sección electoral contiene el punto de las coordenadas.
8.  El backend devuelve la información de la sección encontrada.
9.  El frontend muestra una alerta con el número de sección y resalta el polígono correspondiente en el mapa.
