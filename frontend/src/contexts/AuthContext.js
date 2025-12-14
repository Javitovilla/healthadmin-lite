import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verificarAuth = async () => {
      const token = authService.getToken();
      const usuarioGuardado = authService.getUsuario();

      if (token && usuarioGuardado) {
        const esValido = await authService.verificarToken();
        
        if (esValido) {
          setUsuario(usuarioGuardado);
          setIsAuthenticated(true);
        } else {
          authService.logout();
        }
      }
      
      setLoading(false);
    };

    verificarAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUsuario(data.usuario);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Error en login' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
    setIsAuthenticated(false);
  };

  const value = {
    usuario,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};