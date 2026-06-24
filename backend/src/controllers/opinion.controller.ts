import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import pool from '../config/db';

/**
 * Obtenemos todas las opiniones de la base de datos ordenadas por fecha de registro en orden descendente.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await getOpiniones(req, res);
 */
export const getOpiniones = async (req: Request, res: Response) => {
  try {
    // Se podria usar un join simple aquí más adelante pero por ahora dejamos la consulta simple
    const result = await pool.query('SELECT * FROM opiniones ORDER BY fecha_registro DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error recibiendo opiniones', error });
  }
};

/**
 * Obtenemos una opinión específica por su ID.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await getOpinionById(req, res);
 */
export const getOpinionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM opiniones WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Opinion no encontrada' });
      return;
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error recibiendo opinión', error });
  }
};

/**
 * Creamos una nueva opinión en la base de datos utilizando los datos proporcionados en el cuerpo de la solicitud.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await createOpinion(req, res);
 */
export const createOpinion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Extraemos el ID del usuario autenticado de forma segura desde el token JWT verificado, NO desde el cuerpo de la solicitud
    const usuario_id = req.user?.id;

    const { proyecto_id, emocion, descripcion, foto_url, categoria } = req.body;
    
    const query = `
      INSERT INTO opiniones (usuario_id, proyecto_id, emocion, descripcion, foto_url, categoria)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [usuario_id, proyecto_id, emocion, descripcion, foto_url, categoria];

    const result = await pool.query(query, values);
    
    res.status(201).json({ success: true, message: 'Opinion entregada exitosamente', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error entregando opinión', error });
  }
};

/**
 * Actualizamos el estado de una opinión específica por su ID utilizando los datos proporcionados en el cuerpo de la solicitud.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await updateOpinion(req, res);
 */
export const updateOpinion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const query = `
      UPDATE opiniones 
      SET estado = COALESCE($1, estado)
      WHERE id = $2
      RETURNING *;
    `;
    
    const result = await pool.query(query, [estado, id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Opinion no encontrada para actualizar' });
      return;
    }

    res.status(200).json({ success: true, message: 'Estado de la opinión actualizado', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error actualizando opinión', error });
  }
};

/**
 * Eliminamos una opinión específica por su ID.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await deleteOpinion(req, res);
 */
export const deleteOpinion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM opiniones WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Opinion no encontrada para eliminar' });
      return;
    }

    res.status(200).json({ success: true, message: 'Opinion eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error eliminando opinión', error });
  }
};