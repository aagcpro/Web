# Datos de Secciones Electorales del INE

Para que este proyecto funcione, necesitas los datos geoespaciales de las secciones electorales de México.

## Fuente de Datos

Puedes descargar los datos del **Marco Geoestadístico Nacional** del INEGI o de fuentes de datos abiertos del gobierno. Generalmente, estos datos vienen en formato **Shapefile (.shp)**.

1.  **Descarga:** Busca "Marco Geoestadístico Nacional INEGI" o "Cartografía electoral INE" para encontrar los archivos más recientes.
2.  **Proyección:** Asegúrate de que los datos estén en una proyección geográfica estándar como WGS84 (EPSG:4326) o conviértelos a ella.

## Importación a PostGIS

Una vez que tengas los archivos Shapefile, debes importarlos a tu base de datos PostgreSQL con la extensión PostGIS.

Puedes usar la herramienta `shp2pgsql` que viene con PostGIS.

**Ejemplo de comando:**

```bash
shp2pgsql -s 4326 -I -W "latin1" tu_archivo.shp public.secciones_electorales | psql -h localhost -d gis_ine -U postgres
```

-   `-s 4326`: Especifica el SRID (Sistema de Referencia Espacial) de los datos de entrada (WGS84).
-   `-I`: Crea un índice espacial en la columna de geometría.
-   `-W "latin1"`: Especifica la codificación de caracteres si es necesario.
-   `tu_archivo.shp`: El nombre de tu archivo Shapefile.
-   `public.secciones_electorales`: El esquema y nombre de la tabla que se creará en la base de datos.
-   `psql -h localhost -d gis_ine -U postgres`: El comando para conectarse a tu base de datos. Ajusta los parámetros (`-d` para la base de datos, `-U` para el usuario) según tu configuración.

Después de la importación, tendrás una tabla llamada `secciones_electorales` en tu base de datos `gis_ine` lista para ser consultada por el backend.
