import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { 
  getProyectos, 
  getProyectoById, 
  createProyecto, 
  updateProyecto, 
  deleteProyecto 
} from '../controllers/proyecto.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

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

// --- RUTAS PÚBLICAS ---
router.get('/', getProyectos);
router.get('/:id', getProyectoById);

// --- RUTAS PROTEGIDAS DE ADMINISTRADOR ---
router.post('/', [
  protect, 
  authorize('admin'), // Only admins can create projects
  body('nombre').notEmpty().withMessage('Nombre is required'),
  body('tipo').notEmpty().withMessage('Tipo is required'),
  body('descripcion').notEmpty().withMessage('Descripcion is required'),
  body('lat').isNumeric().withMessage('Lat must be a valid number'),
  body('lng').isNumeric().withMessage('Lng must be a valid number'),
  validateRequest
], createProyecto);

router.put('/:id', protect, authorize('admin'), updateProyecto);
router.delete('/:id', protect, authorize('admin'), deleteProyecto);

export default router;