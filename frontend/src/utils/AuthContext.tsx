import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'user' | 'admin';

// Información del usuario autenticado tal como la devuelve el backend.
export interface AuthUser {
  id: number;
  nombre_completo: string;
  correo: string;
  rol: UserRole;
}

type AuthContextValue = {
  isAuthenticated: boolean;
  role: UserRole;
  user: AuthUser | null;
  // Guarda la sesión obtenida del backend (tras login o registro).
  setSession: (user: AuthUser, token: string) => void;
  logout: () => void;
};

const STORAGE_TOKEN = 'token';
const STORAGE_USER = 'user';

// Lee el usuario persistido en localStorage (si lo hay) para mantener la sesión tras recargar.
function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  role: 'user',
  user: null,
  setSession: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

  // La sesión es válida solo si tenemos usuario Y token en localStorage.
  const isAuthenticated = Boolean(user) && Boolean(localStorage.getItem(STORAGE_TOKEN));
  const role: UserRole = user?.rol === 'admin' ? 'admin' : 'user';

  const setSession = (nextUser: AuthUser, token: string) => {
    localStorage.setItem(STORAGE_TOKEN, token);
    localStorage.setItem(STORAGE_USER, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, user, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
