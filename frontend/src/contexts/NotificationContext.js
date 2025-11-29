import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Context para manejo de notificaciones globales
 * Implementa useState y useCallback para manejo de estado y optimización
 */
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notificacion, setNotificacion] = useState(null);

  /**
   * Mostrar una notificación
   * useCallback para evitar recreación de la función
   */
  const mostrarNotificacion = useCallback((mensaje, tipo = 'info', duracion = 3000) => {
    setNotificacion({ mensaje, tipo });
    
    // Auto-ocultar después de la duración especificada
    setTimeout(() => {
      setNotificacion(null);
    }, duracion);
  }, []);

  /**
   * Ocultar notificación manualmente
   */
  const ocultarNotificacion = useCallback(() => {
    setNotificacion(null);
  }, []);

  const value = {
    notificacion,
    mostrarNotificacion,
    ocultarNotificacion
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notificacion && (
        <div className={`notification notification-${notificacion.tipo}`}>
          <span>{notificacion.mensaje}</span>
          <button onClick={ocultarNotificacion}>✕</button>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de notificaciones
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider');
  }
  return context;
};

export default NotificationContext;
