import React, { useEffect, useState } from 'react';
import { usePacientes } from '../contexts/PacienteContext';
import { useNavigate } from 'react-router-dom';

const ListaPacientes = () => {
  const { pacientes, obtenerPacientes, eliminarPaciente, loading } = usePacientes();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    obtenerPacientes();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este paciente?')) {
      await eliminarPaciente(id);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="lista-pacientes">
      <h2>Lista de Pacientes</h2>
      <div className="acciones">
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/pacientes/nuevo')}
        >
          Nuevo Paciente
        </button>
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Documento</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map(paciente => (
            <tr key={paciente.id}>
              <td>{paciente.numeroDocumento}</td>
              <td>{paciente.nombres} {paciente.apellidos}</td>
              <td>{paciente.telefono}</td>
              <td>{paciente.email}</td>
              <td>
                <button onClick={() => navigate(`/pacientes/${paciente.id}`)}>Ver</button>
                <button onClick={() => navigate(`/pacientes/editar/${paciente.id}`)}>Editar</button>
                <button onClick={() => handleEliminar(paciente.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaPacientes;