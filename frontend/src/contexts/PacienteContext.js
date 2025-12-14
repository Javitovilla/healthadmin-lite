import React, { createContext, useContext, useReducer, useEffect } from 'react';
import pacienteService from '../services/pacienteService';

// Crear el contexto
const PacienteContext = createContext();

// Estado inicial
const initialState = {
  pacientes: [],
  pacienteActual: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 0
  }
};

// Tipos de acciones para el reducer
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_PACIENTES: 'SET_PACIENTES',
  SET_PACIENTE_ACTUAL: 'SET_PACIENTE_ACTUAL',
  ADD_PACIENTE: 'ADD_PACIENTE',
  UPDATE_PACIENTE: 'UPDATE_PACIENTE',
  DELETE_PACIENTE: 'DELETE_PACIENTE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_PAGINATION: 'SET_PAGINATION'
};

/**
 * Reducer para manejar el estado de pacientes
 * Implementa useReducer para manejo de estado complejo
 */
const pacienteReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case ACTIONS.SET_PACIENTES:
      return {
        ...state,
        pacientes: action.payload,
        loading: false,
        error: null
      };
    
    case ACTIONS.SET_PACIENTE_ACTUAL:
      return {
        ...state,
        pacienteActual: action.payload,
        loading: false
      };
    
    case ACTIONS.ADD_PACIENTE:
      return {
        ...state,
        pacientes: [action.payload, ...state.pacientes],
        loading: false
      };
    
    case ACTIONS.UPDATE_PACIENTE:
      return {
        ...state,
        pacientes: state.pacientes.map(p => 
          p.id === action.payload.id ? action.payload : p
        ),
        pacienteActual: action.payload,
        loading: false
      };
    
    case ACTIONS.DELETE_PACIENTE:
      return {
        ...state,
        pacientes: state.pacientes.filter(p => p.id !== action.payload),
        loading: false
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload
      };
    
    default:
      return state;
  }
};

/**
 * Provider del contexto de pacientes
 * Proporciona el estado y las funciones para manipular pacientes
 */
export const PacienteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pacienteReducer, initialState);

  /**
   * Obtener lista de pacientes con paginación
   * Implementa useEffect para cargas asíncronas
   */
  const obtenerPacientes = async (page = 1, limit = 10, search = '') => {
  console.log('🔵 obtenerPacientes LLAMADO'); // ← AGREGAR ESTA LÍNEA
  dispatch({ type: ACTIONS.SET_LOADING, payload: true });
  try {
    console.log('🟢 Antes de llamar pacienteService'); // ← AGREGAR ESTA LÍNEA
    const response = await pacienteService.obtenerPacientes(page, limit, search);
    console.log('🟢 Respuesta recibida:', response); // ← AGREGAR ESTA LÍNEA
    dispatch({ type: ACTIONS.SET_PACIENTES, payload: response.data });
    dispatch({ type: ACTIONS.SET_PAGINATION, payload: response.pagination });
  } catch (error) {
    console.error('🔴 ERROR en obtenerPacientes:', error); // ← AGREGAR ESTA LÍNEA
    dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
  }
};

  /**
   * Obtener un paciente por ID
   */
  const obtenerPacientePorId = async (id) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await pacienteService.obtenerPacientePorId(id);
      dispatch({ type: ACTIONS.SET_PACIENTE_ACTUAL, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  /**
   * Crear un nuevo paciente
   */
  const crearPaciente = async (datosPaciente) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await pacienteService.crearPaciente(datosPaciente);
      dispatch({ type: ACTIONS.ADD_PACIENTE, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  /**
   * Actualizar un paciente existente
   */
  const actualizarPaciente = async (id, datosPaciente) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await pacienteService.actualizarPaciente(id, datosPaciente);
      dispatch({ type: ACTIONS.UPDATE_PACIENTE, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  /**
   * Eliminar un paciente
   */
  const eliminarPaciente = async (id) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await pacienteService.eliminarPaciente(id);
      dispatch({ type: ACTIONS.DELETE_PACIENTE, payload: id });
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  /**
   * Limpiar errores
   */
  const limpiarError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  /**
   * Limpiar paciente actual
   */
  const limpiarPacienteActual = () => {
    dispatch({ type: ACTIONS.SET_PACIENTE_ACTUAL, payload: null });
  };

  // Valor del contexto
  const value = {
    ...state,
    obtenerPacientes,
    obtenerPacientePorId,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    limpiarError,
    limpiarPacienteActual
  };

  return (
    <PacienteContext.Provider value={value}>
      {children}
    </PacienteContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de pacientes
 * Implementa useContext para acceder al estado global
 */
export const usePacientes = () => {
  const context = useContext(PacienteContext);
  if (!context) {
    throw new Error('usePacientes debe ser usado dentro de PacienteProvider');
  }
  return context;
};

export default PacienteContext;
