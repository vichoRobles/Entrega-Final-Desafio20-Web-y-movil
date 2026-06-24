import { Response } from 'express';
import pool from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Obtenemos todos los usuarios de la base de datos, solo para administradores.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await getUsuarios(req, res);
 */
export const getUsuarios = async (req: AuthRequest, res: Response) => {
  try {
    // NO seleccionamos la columna de contraseña por seguridad
    const result = await pool.query('SELECT id, rut, nombre_completo, correo, region, comuna, rol, creado_en FROM usuarios');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error recibiendo usuarios', error });
  }
};

/**
 * Obtenemos el perfil del usuario actualmente autenticado utilizando su ID extraído del token JWT.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await getMiPerfil(req, res);
 */
export const getMiPerfil = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Obtenemos el ID de forma segura desde el token JWT verificado, NO desde la URL
    const userId = req.user?.id; 
    
    const result = await pool.query('SELECT id, rut, nombre_completo, correo, region, comuna, rol, creado_en FROM usuarios WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error recibiendo perfil', error });
  }
};