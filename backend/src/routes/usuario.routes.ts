import { Router } from 'express';
import { getUsuarios, getMiPerfil } from '../controllers/usuario.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Ruta 1 -- Obtiene el perfil autenticado actual
// Requiere estar logueado (protect) pero no requiere ser admin, cualquier usuario autenticado puede ver su propio perfil
router.get('/me', protect, getMiPerfil);

// Ruta 2 -- Obtiene todos los usuarios
// Requiere estar logueado (protect) Y ser admin (authorize)
router.get('/', protect, authorize('admin'), getUsuarios);

export default router;