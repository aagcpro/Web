const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // Reemplaza con tu usuario de PostgreSQL
  host: 'localhost',
  database: 'gis_ine', // Reemplaza con tu nombre de base de datos
  password: 'tu_password', // Reemplaza con tu contraseña
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
