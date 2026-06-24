import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { registerUser, loginUser } from '../controllers/auth.controller';

const router = Router();

// Middleware para verificar los resultados de validación
const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }
  next();
};

// POST /api/auth/register
router.post('/register', [
  // Validation Rules
  body('rut').notEmpty().withMessage('Se requiere el RUT'),
  body('nombre_completo').notEmpty().withMessage('Se requiere el nombre completo'),
  body('correo').isEmail().withMessage('Debe ser un email válido'),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('region').notEmpty().withMessage('Se requiere la región'),
  body('comuna').notEmpty().withMessage('Se requiere la comuna'),
  validateRequest // Run the checker
], registerUser);

// POST /api/auth/login
router.post('/login', [
  body('correo').isEmail().withMessage('Debe ser un email válido'),
  body('contrasena').notEmpty().withMessage('La contraseña es requerida'),
  validateRequest
], loginUser);

export default router;