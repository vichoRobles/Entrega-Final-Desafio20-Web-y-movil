import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { 
  getOpiniones, 
  getOpinionById, 
  createOpinion, 
  updateOpinion, 
  deleteOpinion 
} from '../controllers/opinion.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }
  next();
};

// --- RUTAS PUBLICAS ---
router.get('/', getOpiniones);
router.get('/:id', getOpinionById);

// --- RUTAS PROTEGIDAS ---
router.post('/', [
  protect, // Any logged-in user can post
  body('proyecto_id').isInt().withMessage('Valid proyecto_id is required'),
  body('emocion').notEmpty().withMessage('Emocion is required'),
  body('descripcion').notEmpty().withMessage('Descripcion is required'),
  body('categoria').notEmpty().withMessage('Categoria is required'),
  validateRequest
], createOpinion);

// --- RUTAS PROTEGIDAS DE ADMINISTRADOR ---
router.put('/:id', protect, authorize('admin'), updateOpinion); // Admins pueden actualizar opiniones (ej. para moderar contenido inapropiado)
router.delete('/:id', protect, authorize('admin'), deleteOpinion); // Admins pueden eliminar opiniones tambien

export default router;