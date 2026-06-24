import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extendemos el objeto Request de Express para incluir nuestro payload personalizado de usuario
export interface AuthRequest extends Request {
  user?: {
    id: number;
    rol: string;
  };
}

// Este middleware se encarga de verificar que el usuario esté autenticado mediante un token JWT válido. 
// Si el token es correcto, se extrae la información del usuario (ID y rol) y se adjunta al objeto `req.user` para que las siguientes funciones puedan acceder a ella.
// Si el token no es válido o no se proporciona, se devuelve un error 401 Unauthorized.
export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  let token;

  // Chekeamos si el token está en los headers (Formato estándar: "Bearer <token>")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'No autorizado para acceder a esta ruta, no se proporcionó token' });
    return;
  }

  try {
    // Verificamos el token usando la clave secreta y extraemos el payload (ID y rol del usuario)
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; rol: string };
    
    // Adjuntamos la información del usuario al objeto req para que esté disponible en las siguientes funciones
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'No autorizado, token inválido' });
  }
};

// Este middleware (EP2.5d) se encarga de verificar que el usuario autenticado tenga uno de los roles permitidos para acceder a la ruta.
// Recibe una lista de roles permitidos (por ejemplo: 'admin', 'user') y compara el rol del usuario extraído del token con esta lista.
// Si el rol del usuario no está en la lista, se devuelve un error 403 Forbidden. Si el rol es correcto, se permite el acceso a la ruta.
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.rol)) {
      res.status(403).json({ 
        success: false, 
        message: `Usuario con rol '${req.user?.rol}' no está autorizado para acceder a esta ruta.` 
      });
      return;
    }
    next(); 
  };
};