import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Creamos una nueva conexión a la base de datos utilizando las credenciales del archivo .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

// Este listener se activa cada vez que se establece una conexión exitosa a la base de datos, proporcionando un mensaje de confirmación en la consola.
pool.on('connect', () => {
  console.log('📦 Conexión a la base de datos establecida de forma exitosa');
});

// Este listener captura cualquier error inesperado en la conexión a la base de datos y lo registra, evitando que el servidor se caiga sin aviso.
pool.on('error', (err) => {
  console.error('❌ Error inesperado en la conexión a la base de datos:', err);
  process.exit(-1);
});

/**
 * Verifica la conexión a la base de datos ejecutando una consulta simple (`SELECT NOW()`).
 *
 * - Logea la hora actual de la base de datos si la conexión es exitosa.
 * - Logea el error si la conexión falla, proporcionando detalles para facilitar la depuración.
 *
 * @async
 * @returns {Promise<void>} Resuelve cuando la comprobación ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await checkDatabaseConnection();
 */
async function checkDatabaseConnection(): Promise<void> {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Conexión a la base de datos verificada:', res.rows[0].now);
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
}
export default pool;
export { checkDatabaseConnection };