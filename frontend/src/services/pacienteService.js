import { api } from './authService';

const pacienteService = {
  // Obtener todos los pacientes con paginación y búsqueda
  obtenerPacientes: async (page = 1, limit = 100, search = '') => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      const url = `/pacientes${params.toString() ? '?' + params.toString() : ''}`;
      const response = await api.get(url);
      
      // Adaptar respuesta al formato que espera el contexto
      return {
        data: response.data.data || response.data,
        pagination: {
          total: response.data.total || 0,
          page: page,
          pages: 1
        }
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener un paciente por ID
  obtenerPacientePorId: async (id) => {
    try {
      const response = await api.get(`/pacientes/${id}`);
      return {
        data: response.data.data || response.data
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Crear nuevo paciente
  crearPaciente: async (datosPaciente) => {
    try {
      const response = await api.post('/pacientes', datosPaciente);
      return {
        data: response.data.data || response.data
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Actualizar paciente
  actualizarPaciente: async (id, datosPaciente) => {
    try {
      const response = await api.put(`/pacientes/${id}`, datosPaciente);
      return {
        data: response.data.data || response.data
      };
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Eliminar paciente
  eliminarPaciente: async (id) => {
    try {
      const response = await api.delete(`/pacientes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default pacienteService;