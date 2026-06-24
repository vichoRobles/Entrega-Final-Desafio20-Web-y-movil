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
    const { nombre, tipo, descripcion, estado, lat, lng, fecha_inicio, fecha_fin, presupuesto, ubicacion_texto } = req.body;

    const query = `
      INSERT INTO proyectos (nombre, tipo, descripcion, estado, lat, lng, fecha_inicio, fecha_fin, presupuesto, ubicacion_texto)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    // Si no llega 'estado', usamos el valor por defecto del esquema ('Planificado').
    const values = [nombre, tipo, descripcion, estado || 'Planificado', lat, lng, fecha_inicio || null, fecha_fin || null, presupuesto ?? 0, ubicacion_texto || null];
    
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
    const { nombre, tipo, descripcion, estado, lat, lng, fecha_inicio, fecha_fin, presupuesto, ubicacion_texto } = req.body;

    // Usamos COALESCE para que solo se actualicen los campos efectivamente enviados.
    const query = `
      UPDATE proyectos 
      SET nombre = COALESCE($1, nombre), 
          tipo = COALESCE($2, tipo), 
          descripcion = COALESCE($3, descripcion), 
          estado = COALESCE($4, estado), 
          lat = COALESCE($5, lat), 
          lng = COALESCE($6, lng), 
          fecha_inicio = COALESCE($7, fecha_inicio), 
          fecha_fin = COALESCE($8, fecha_fin), 
          presupuesto = COALESCE($9, presupuesto), 
          ubicacion_texto = COALESCE($10, ubicacion_texto)
      WHERE id = $11
      RETURNING *;
    `;

    const values = [
      nombre ?? null,
      tipo ?? null,
      descripcion ?? null,
      estado ?? null,
      lat ?? null,
      lng ?? null,
      fecha_inicio ?? null,
      fecha_fin ?? null,
      presupuesto ?? null,
      ubicacion_texto ?? null,
      id,
    ];

    const result = await pool.query(query, values);

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