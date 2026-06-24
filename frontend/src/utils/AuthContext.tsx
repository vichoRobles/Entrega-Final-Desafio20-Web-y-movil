import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'user' | 'admin';

type AuthContextValue = {
  isAuthenticated: boolean;
  role: UserRole;
  login: (nextRole?: UserRole) => void;
  logout: () => void;
  setRole: (nextRole: UserRole) => void;
};

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  role: 'user',
  login: () => {},
  logout: () => {},
  setRole: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [role, setRole] = useState<UserRole>('admin'); // or 'user'

  
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  //const [role, setRole] = useState<UserRole>('user');

  const login = (nextRole: UserRole = 'user') => {
    setRole(nextRole);
    setIsAuthenticated(true);
  };

  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);