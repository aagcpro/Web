const db = require('../config/db');

// Obtener todas las secciones como GeoJSON
const getSecciones = async (req, res) => {
  try {
    const query = `
      SELECT json_build_object(
        'type', 'FeatureCollection',
        'features', json_agg(ST_AsGeoJSON(t.*)::json)
      )
      FROM (
        SELECT id, clave_ent, seccion, ST_Transform(geom, 4326) as geom 
        FROM secciones_electorales
      ) AS t;
    `;
    const { rows } = await db.query(query);
    res.json(rows[0].json_build_object);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};

// Encontrar la sección electoral que contiene un punto (lat, lng)
const getSeccionByLocation = async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).send('Faltan los parámetros de latitud y longitud.');
  }

  try {
    const query = `
      SELECT id, clave_ent, seccion
      FROM secciones_electorales
      WHERE ST_Contains(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326));
    `;
    const { rows } = await db.query(query, [lng, lat]); // PostGIS usa (longitud, latitud)
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send('No se encontró una sección electoral para la ubicación proporcionada.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
};

module.exports = {
  getSecciones,
  getSeccionByLocation,
};
