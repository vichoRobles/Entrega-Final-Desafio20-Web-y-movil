import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';

// Función para generar un token JWT con el ID y rol del usuario, utilizando la clave secreta definida en las variables de entorno y con una expiración de 30 días.
const generateToken = (id: number, rol: string) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

/**
 * Registramos un nuevo usuario en la base de datos. 
 * Primero verificamos que no exista un usuario con el mismo correo o RUT, 
 * luego hasheamos la contraseña utilizando bcrypt y finalmente insertamos el nuevo usuario en la base de datos. 
 * Si el registro es exitoso, generamos un token JWT para el nuevo usuario y lo devolvemos junto con su información (sin la contraseña).
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla o si el usuario ya existe.
 * @example
 * await registerUser(req, res);
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rut, nombre_completo, correo, region, comuna, contrasena } = req.body;

    const userExists = await pool.query('SELECT * FROM usuarios WHERE correo = $1 OR rut = $2', [correo, rut]);
    if (userExists.rows.length > 0) {
      res.status(400).json({ success: false, message: 'Usuario con este correo o RUT ya existe' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

    const query = `
      INSERT INTO usuarios (rut, nombre_completo, correo, region, comuna, contrasena)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, rut, nombre_completo, correo, rol;
    `;
    const result = await pool.query(query, [rut, nombre_completo, correo, region, comuna, hashedPassword]);
    const newUser = result.rows[0];

    const token = generateToken(newUser.id, newUser.rol);

    res.status(201).json({ success: true, data: newUser, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor', error });
  }
};

/**
 * Autenticamos a un usuario existente.
 * 
 * @async
 * @returns {Promise<void>} Resuelve cuando la consulta ha terminado.
 * @throws {Error} Si la consulta falla o si el usuario ya existe.
 * @example
 * await loginUser(req, res);
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo, contrasena } = req.body;

    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      return;
    }

    const token = generateToken(user.id, user.rol);

    res.status(200).json({
      success: true,
      data: { id: user.id, nombre_completo: user.nombre_completo, correo: user.correo, rol: user.rol },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor', error });
  }
};