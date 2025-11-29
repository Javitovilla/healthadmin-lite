import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePacientes } from '../contexts/PacienteContext';

const DetallePaciente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pacienteActual, obtenerPacientePorId, loading } = usePacientes();

  useEffect(() => {
    obtenerPacientePorId(id);
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!pacienteActual) return <div>Paciente no encontrado</div>;

  return (
    <div className="detalle-paciente">
      <h2>Detalles del Paciente</h2>
      <div className="info-paciente">
        <p><strong>Nombre:</strong> {pacienteActual.nombres} {pacienteActual.apellidos}</p>
        <p><strong>Documento:</strong> {pacienteActual.tipoDocumento} - {pacienteActual.numeroDocumento}</p>
        <p><strong>Teléfono:</strong> {pacienteActual.telefono}</p>
        <p><strong>Email:</strong> {pacienteActual.email}</p>
        <p><strong>Dirección:</strong> {pacienteActual.direccion}</p>
        <p><strong>EPS:</strong> {pacienteActual.eps}</p>
        <p><strong>Grupo Sanguíneo:</strong> {pacienteActual.grupoSanguineo}</p>
      </div>
      <button onClick={() => navigate('/pacientes')}>Volver</button>
      <button onClick={() => navigate(`/pacientes/editar/${id}`)}>Editar</button>
    </div>
  );
};

export default DetallePaciente;