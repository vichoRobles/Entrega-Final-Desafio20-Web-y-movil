import { Request, Response } from 'express';
import pool from '../config/db';

/**
 * Obtenemos todos los proyectos de la base de datos ordenados por ID en orden descendente.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await getProyectos(req, res);
 */
export const getProyectos = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM proyectos ORDER BY id DESC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error recibiendo proyectos', error });
  }
};

/**
 * Obtenemos un proyecto específico por su ID.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await getProyectoById(req, res);
 */
export const getProyectoById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM proyectos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
      return;
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error recibiendo proyecto', error });
  }
};

/**
 * Creamos un nuevo proyecto en la base de datos utilizando los datos proporcionados en el cuerpo de la solicitud.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await createProyecto(req, res);
 */
export const createProyecto = async (req: Request, res: Response) => {
  try {
    const { nombre, tipo, descripcion, lat, lng, fecha_inicio, fecha_fin, presupuesto, ubicacion_texto } = req.body;
    
    const query = `
      INSERT INTO proyectos (nombre, tipo, descripcion, lat, lng, fecha_inicio, fecha_fin, presupuesto, ubicacion_texto)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const values = [nombre, tipo, descripcion, lat, lng, fecha_inicio, fecha_fin, presupuesto, ubicacion_texto];
    
    const result = await pool.query(query, values);
    
    res.status(201).json({ success: true, message: 'Proyecto creado', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creando proyecto', error });
  }
};

/**
 * Actualizamos un proyecto específico por su ID utilizando los datos proporcionados en el cuerpo de la solicitud.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await updateProyecto(req, res);
 */
export const updateProyecto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, estado, presupuesto } = req.body; 

    const query = `
      UPDATE proyectos 
      SET nombre = COALESCE($1, nombre), 
          estado = COALESCE($2, estado), 
          presupuesto = COALESCE($3, presupuesto)
      WHERE id = $4
      RETURNING *;
    `;
    
    const result = await pool.query(query, [nombre, estado, presupuesto, id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Proyecto no encontrado para actualizar' });
      return;
    }

    res.status(200).json({ success: true, message: 'Proyecto actualizado', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error actualizando proyecto', error });
  }
};

/**
 * Eliminamos un proyecto específico por su ID de la base de datos.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla.
 * @example
 * await deleteProyecto(req, res);
 */
export const deleteProyecto = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM proyectos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Proyecto no encontrado para eliminar' });
      return;
    }

    res.status(200).json({ success: true, message: 'Proyecto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error eliminando proyecto', error });
  }
};