import axios from 'axios';

// Configuración base de Axios
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Instancia de Axios configurada para la API
 * Implementa interceptores para manejo de errores y tokens
 */
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests - puede agregar tokens de autenticación aquí
axiosInstance.interceptors.request.use(
  (config) => {
    // Aquí se podría agregar un token de autenticación
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log('📤 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejo centralizado de errores
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    return response.data;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    
    // Manejo de errores específicos
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error(error.response.data.error || 'Datos inválidos');
        case 404:
          throw new Error('Recurso no encontrado');
        case 500:
          throw new Error('Error del servidor. Por favor intente más tarde');
        default:
          throw new Error(error.response.data.error || 'Error desconocido');
      }
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      throw new Error('Error al procesar la solicitud');
    }
  }
);

/**
 * Servicio de pacientes con todas las operaciones CRUD
 * Utiliza Axios para peticiones HTTP a la API REST
 */
const pacienteService = {
  /**
   * Obtener todos los pacientes con paginación y búsqueda
   * @param {number} page - Página actual
   * @param {number} limit - Cantidad de resultados por página
   * @param {string} search - Término de búsqueda
   */
  obtenerPacientes: async (page = 1, limit = 10, search = '') => {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search })
    });
    return axiosInstance.get(`/pacientes?${params}`);
  },

  /**
   * Obtener un paciente específico por ID
   * @param {string} id - ID del paciente
   */
  obtenerPacientePorId: async (id) => {
    return axiosInstance.get(`/pacientes/${id}`);
  },

  /**
   * Crear un nuevo paciente
   * @param {Object} datosPaciente - Datos del nuevo paciente
   */
  crearPaciente: async (datosPaciente) => {
    return axiosInstance.post('/pacientes', datosPaciente);
  },

  /**
   * Actualizar un paciente existente
   * @param {string} id - ID del paciente a actualizar
   * @param {Object} datosPaciente - Nuevos datos del paciente
   */
  actualizarPaciente: async (id, datosPaciente) => {
    return axiosInstance.put(`/pacientes/${id}`, datosPaciente);
  },

  /**
   * Eliminar un paciente (soft delete - cambio de estado)
   * @param {string} id - ID del paciente a eliminar
   */
  eliminarPaciente: async (id) => {
    return axiosInstance.delete(`/pacientes/${id}`);
  },

  /**
   * Buscar pacientes por diferentes criterios
   * @param {Object} criterios - Criterios de búsqueda
   */
  buscarPacientes: async (criterios) => {
    const params = new URLSearchParams(criterios);
    return axiosInstance.get(`/pacientes/buscar?${params}`);
  },

  /**
   * Exportar lista de pacientes a Excel
   */
  exportarPacientes: async () => {
    return axiosInstance.get('/pacientes/exportar', {
      responseType: 'blob'
    });
  },

  /**
   * Obtener estadísticas de pacientes
   */
  obtenerEstadisticas: async () => {
    return axiosInstance.get('/pacientes/estadisticas');
  }
};

/**
 * Servicio de autenticación (para futura implementación)
 */
const authService = {
  /**
   * Login de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   */
  login: async (email, password) => {
    return axiosInstance.post('/auth/login', { email, password });
  },

  /**
   * Logout de usuario
   */
  logout: async () => {
    return axiosInstance.post('/auth/logout');
  },

  /**
   * Verificar token actual
   */
  verificarToken: async () => {
    return axiosInstance.get('/auth/verify');
  }
};

// Exportar servicios
export { pacienteService, authService, axiosInstance };
export default pacienteService;
