import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePacientes } from '../contexts/PacienteContext';
import { useNotification } from '../contexts/NotificationContext';
import './FormularioPaciente.css';

/**
 * Componente de formulario para crear y editar pacientes
 * Implementa useState, useEffect, useCallback, useMemo para manejo de estado y optimización
 */
const FormularioPaciente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { crearPaciente, actualizarPaciente, obtenerPacientePorId, loading } = usePacientes();
  const { mostrarNotificacion } = useNotification();
  
  // Estado inicial del formulario
  const estadoInicial = {
    tipoDocumento: 'CC',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: 'M',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: 'Bogotá',
    eps: '',
    grupoSanguineo: 'O+',
    alergias: 'Ninguna',
    contactoEmergencia: {
      nombre: '',
      telefono: '',
      parentesco: ''
    }
  };

  // Hook useState para manejar el estado del formulario
  const [formData, setFormData] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  // Hook useEffect para cargar datos del paciente en modo edición
  useEffect(() => {
    if (id) {
      cargarPaciente();
    }
  }, [id]);

  /**
   * Cargar datos del paciente para edición
   * Implementa useCallback para evitar recreación de funciones
   */
  const cargarPaciente = useCallback(async () => {
    try {
      const paciente = await obtenerPacientePorId(id);
      // Formatear fecha para input date
      if (paciente.fechaNacimiento) {
        paciente.fechaNacimiento = paciente.fechaNacimiento.split('T')[0];
      }
      setFormData(paciente);
    } catch (error) {
      mostrarNotificacion('Error al cargar paciente', 'error');
      navigate('/pacientes');
    }
  }, [id, obtenerPacientePorId, mostrarNotificacion, navigate]);

  /**
   * Manejar cambios en los inputs del formulario
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si es un campo del contacto de emergencia
    if (name.startsWith('contacto.')) {
      const campo = name.split('.')[1];
      setFormData(prevState => ({
        ...prevState,
        contactoEmergencia: {
          ...prevState.contactoEmergencia,
          [campo]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prevState => ({
        ...prevState,
        [name]: ''
      }));
    }
  };

  /**
   * Validación del formulario
   * Implementa useMemo para optimizar validaciones complejas
   */
  const validarFormulario = useMemo(() => {
    return () => {
      const nuevosErrores = {};
      
      // Validaciones básicas
      if (!formData.numeroDocumento) {
        nuevosErrores.numeroDocumento = 'El número de documento es obligatorio';
      } else if (formData.numeroDocumento.length < 5) {
        nuevosErrores.numeroDocumento = 'El número de documento debe tener al menos 5 caracteres';
      }
      
      if (!formData.nombres) {
        nuevosErrores.nombres = 'Los nombres son obligatorios';
      }
      
      if (!formData.apellidos) {
        nuevosErrores.apellidos = 'Los apellidos son obligatorios';
      }
      
      if (!formData.fechaNacimiento) {
        nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
      } else {
        const fecha = new Date(formData.fechaNacimiento);
        if (fecha > new Date()) {
          nuevosErrores.fechaNacimiento = 'La fecha de nacimiento no puede ser futura';
        }
      }
      
      if (!formData.telefono) {
        nuevosErrores.telefono = 'El teléfono es obligatorio';
      } else if (!/^[0-9]{7,10}$/.test(formData.telefono)) {
        nuevosErrores.telefono = 'El teléfono debe tener entre 7 y 10 dígitos';
      }
      
      if (!formData.email) {
        nuevosErrores.email = 'El correo electrónico es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        nuevosErrores.email = 'El correo electrónico no es válido';
      }
      
      if (!formData.direccion) {
        nuevosErrores.direccion = 'La dirección es obligatoria';
      }
      
      if (!formData.eps) {
        nuevosErrores.eps = 'La EPS es obligatoria';
      }
      
      // Validaciones del contacto de emergencia
      if (!formData.contactoEmergencia.nombre) {
        nuevosErrores['contacto.nombre'] = 'El nombre del contacto es obligatorio';
      }
      
      if (!formData.contactoEmergencia.telefono) {
        nuevosErrores['contacto.telefono'] = 'El teléfono del contacto es obligatorio';
      }
      
      if (!formData.contactoEmergencia.parentesco) {
        nuevosErrores['contacto.parentesco'] = 'El parentesco es obligatorio';
      }
      
      return nuevosErrores;
    };
  }, [formData]);

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const erroresValidacion = validarFormulario();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      mostrarNotificacion('Por favor complete todos los campos obligatorios', 'error');
      return;
    }
    
    setEnviando(true);
    
    try {
      if (id) {
        await actualizarPaciente(id, formData);
        mostrarNotificacion('Paciente actualizado exitosamente', 'success');
      } else {
        await crearPaciente(formData);
        mostrarNotificacion('Paciente creado exitosamente', 'success');
      }
      navigate('/pacientes');
    } catch (error) {
      mostrarNotificacion(error.message || 'Error al guardar paciente', 'error');
    } finally {
      setEnviando(false);
    }
  };

  /**
   * Calcular edad basada en fecha de nacimiento
   * Ejemplo de uso de useMemo para cálculos derivados
   */
  const edad = useMemo(() => {
    if (!formData.fechaNacimiento) return '';
    
    const hoy = new Date();
    const nacimiento = new Date(formData.fechaNacimiento);
    let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edadCalculada--;
    }
    
    return edadCalculada;
  }, [formData.fechaNacimiento]);

  return (
    <div className="formulario-paciente">
      <div className="formulario-header">
        <h2>{id ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
        {edad && <span className="edad-badge">Edad: {edad} años</span>}
      </div>
      
      <form onSubmit={handleSubmit} className="formulario">
        {/* Información Personal */}
        <fieldset>
          <legend>Información Personal</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipoDocumento">Tipo de Documento *</label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className={errores.tipoDocumento ? 'error' : ''}
              >
                <option value="CC">Cédula de Ciudadanía</option>
                <option value="TI">Tarjeta de Identidad</option>
                <option value="CE">Cédula de Extranjería</option>
                <option value="PA">Pasaporte</option>
                <option value="RC">Registro Civil</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="numeroDocumento">Número de Documento *</label>
              <input
                type="text"
                id="numeroDocumento"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                className={errores.numeroDocumento ? 'error' : ''}
                placeholder="12345678"
              />
              {errores.numeroDocumento && (
                <span className="error-message">{errores.numeroDocumento}</span>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombres">Nombres *</label>
              <input
                type="text"
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                className={errores.nombres ? 'error' : ''}
                placeholder="Juan Carlos"
              />
              {errores.nombres && (
                <span className="error-message">{errores.nombres}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="apellidos">Apellidos *</label>
              <input
                type="text"
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className={errores.apellidos ? 'error' : ''}
                placeholder="Pérez González"
              />
              {errores.apellidos && (
                <span className="error-message">{errores.apellidos}</span>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento *</label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className={errores.fechaNacimiento ? 'error' : ''}
                max={new Date().toISOString().split('T')[0]}
              />
              {errores.fechaNacimiento && (
                <span className="error-message">{errores.fechaNacimiento}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="genero">Género *</label>
              <select
                id="genero"
                name="genero"
                value={formData.genero}
                onChange={handleChange}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
          </div>
        </fieldset>
        
        {/* Información de Contacto */}
        <fieldset>
          <legend>Información de Contacto</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={errores.telefono ? 'error' : ''}
                placeholder="3001234567"
              />
              {errores.telefono && (
                <span className="error-message">{errores.telefono}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errores.email ? 'error' : ''}
                placeholder="correo@ejemplo.com"
              />
              {errores.email && (
                <span className="error-message">{errores.email}</span>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="direccion">Dirección *</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className={errores.direccion ? 'error' : ''}
                placeholder="Calle 123 # 45-67"
              />
              {errores.direccion && (
                <span className="error-message">{errores.direccion}</span>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad *</label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                placeholder="Bogotá"
              />
            </div>
          </div>
        </fieldset>
        
        {/* Información Médica */}
        <fieldset>
          <legend>Información Médica</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eps">EPS *</label>
              <input
                type="text"
                id="eps"
                name="eps"
                value={formData.eps}
                onChange={handleChange}
                className={errores.eps ? 'error' : ''}
                placeholder="Compensar"
              />
              {errores.eps && (
                <span className="error-message">{errores.eps}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="grupoSanguineo">Grupo Sanguíneo *</label>
              <select
                id="grupoSanguineo"
                name="grupoSanguineo"
                value={formData.grupoSanguineo}
                onChange={handleChange}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="alergias">Alergias</label>
              <textarea
                id="alergias"
                name="alergias"
                value={formData.alergias}
                onChange={handleChange}
                rows="3"
                placeholder="Describa las alergias conocidas del paciente"
              />
            </div>
          </div>
        </fieldset>
        
        {/* Contacto de Emergencia */}
        <fieldset>
          <legend>Contacto de Emergencia</legend>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contacto.nombre">Nombre *</label>
              <input
                type="text"
                id="contacto.nombre"
                name="contacto.nombre"
                value={formData.contactoEmergencia.nombre}
                onChange={handleChange}
                className={errores['contacto.nombre'] ? 'error' : ''}
                placeholder="María González"
              />
              {errores['contacto.nombre'] && (
                <span className="error-message">{errores['contacto.nombre']}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="contacto.telefono">Teléfono *</label>
              <input
                type="tel"
                id="contacto.telefono"
                name="contacto.telefono"
                value={formData.contactoEmergencia.telefono}
                onChange={handleChange}
                className={errores['contacto.telefono'] ? 'error' : ''}
                placeholder="3009876543"
              />
              {errores['contacto.telefono'] && (
                <span className="error-message">{errores['contacto.telefono']}</span>
              )}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contacto.parentesco">Parentesco *</label>
              <input
                type="text"
                id="contacto.parentesco"
                name="contacto.parentesco"
                value={formData.contactoEmergencia.parentesco}
                onChange={handleChange}
                className={errores['contacto.parentesco'] ? 'error' : ''}
                placeholder="Esposa, Hijo, Madre, etc."
              />
              {errores['contacto.parentesco'] && (
                <span className="error-message">{errores['contacto.parentesco']}</span>
              )}
            </div>
          </div>
        </fieldset>
        
        {/* Botones de acción */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/pacientes')}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={enviando || loading}
          >
            {enviando ? 'Guardando...' : (id ? 'Actualizar' : 'Crear')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioPaciente;
