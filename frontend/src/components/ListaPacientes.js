import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Table, Button, Form, InputGroup, Badge, Spinner, Modal } from 'react-bootstrap';
import { usePacientes } from '../contexts/PacienteContext';
import { toast } from 'react-toastify';

const ListaPacientes = () => {
  const navigate = useNavigate();
  const { pacientes, obtenerPacientes, eliminarPaciente, loading } = usePacientes();
  const [busqueda, setBusqueda] = useState('');
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pacienteToDelete, setPacienteToDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    obtenerPacientes();
  }, []);

  useEffect(() => {
    // Filtrar pacientes
    const filtrados = pacientes.filter(paciente => {
      const termino = busqueda.toLowerCase();
      return (
        paciente.nombres?.toLowerCase().includes(termino) ||
        paciente.apellidos?.toLowerCase().includes(termino) ||
        paciente.numeroDocumento?.includes(termino) ||
        paciente.email?.toLowerCase().includes(termino) ||
        paciente.telefono?.includes(termino)
      );
    });
    setPacientesFiltrados(filtrados);
  }, [pacientes, busqueda]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...pacientesFiltrados].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setPacientesFiltrados(sorted);
  };

  const handleDelete = (paciente) => {
    setPacienteToDelete(paciente);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await eliminarPaciente(pacienteToDelete.id || pacienteToDelete._id);
      toast.success('Paciente eliminado exitosamente');
      setShowDeleteModal(false);
      setPacienteToDelete(null);
    } catch (error) {
      toast.error('Error al eliminar el paciente');
    }
  };

  const exportToCSV = () => {
    const headers = ['Documento', 'Nombres', 'Apellidos', 'Teléfono', 'Email', 'EPS', 'Estado'];
    const data = pacientesFiltrados.map(p => [
      p.numeroDocumento,
      p.nombres,
      p.apellidos,
      p.telefono,
      p.email,
      p.eps,
      p.estado
    ]);
    
    let csvContent = headers.join(',') + '\n';
    data.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pacientes.csv';
    a.click();
    toast.success('Archivo CSV descargado');
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="health-loader"></div>
      </div>
    );
  }

  return (
    <Container fluid className="fade-in">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1 className="display-5 fw-bold text-primary mb-2">
                <i className="bi bi-people-fill me-3"></i>
                Gestión de Pacientes
              </h1>
              <p className="text-muted">
                {pacientesFiltrados.length} paciente{pacientesFiltrados.length !== 1 ? 's' : ''} encontrado{pacientesFiltrados.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button 
                variant="primary"
                className="rounded-pill"
                onClick={() => navigate('/pacientes/nuevo')}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Paciente
              </Button>
              <Button 
                variant="outline-success"
                className="rounded-pill"
                onClick={exportToCSV}
                disabled={pacientesFiltrados.length === 0}
              >
                <i className="bi bi-download me-2"></i>
                Exportar CSV
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Barra de búsqueda */}
      <Row className="mb-4">
        <Col lg={6}>
          <InputGroup size="lg">
            <InputGroup.Text className="bg-white">
              <i className="bi bi-search text-muted"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Buscar por nombre, documento, teléfono o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border-start-0"
            />
            {busqueda && (
              <Button 
                variant="outline-secondary"
                onClick={() => setBusqueda('')}
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>

      {/* Tabla de pacientes */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {pacientesFiltrados.length > 0 ? (
            <div className="table-responsive">
              <Table hover className="mb-0 table-health">
                <thead>
                  <tr>
                    <th 
                      onClick={() => handleSort('numeroDocumento')}
                      style={{cursor: 'pointer'}}
                    >
                      Documento
                      {sortConfig.key === 'numeroDocumento' && (
                        <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </th>
                    <th 
                      onClick={() => handleSort('nombres')}
                      style={{cursor: 'pointer'}}
                    >
                      Nombre Completo
                      {sortConfig.key === 'nombres' && (
                        <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                      )}
                    </th>
                    <th>Contacto</th>
                    <th>EPS</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientesFiltrados.map((paciente, index) => (
                    <tr 
                      key={paciente.id || paciente._id}
                      style={{
                        animation: `fadeIn 0.5s ease-in-out ${index * 0.05}s both`
                      }}
                    >
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                               style={{width: '35px', height: '35px', fontSize: '12px'}}>
                            {paciente.tipoDocumento || 'CC'}
                          </div>
                          <span className="fw-bold">{paciente.numeroDocumento}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{paciente.nombres} {paciente.apellidos}</div>
                          <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {paciente.edad || 
                              (paciente.fechaNacimiento ? 
                                new Date().getFullYear() - new Date(paciente.fechaNacimiento).getFullYear() 
                                : 'N/A')} años
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>
                            <i className="bi bi-telephone text-muted me-1"></i>
                            {paciente.telefono}
                          </div>
                          <small>
                            <i className="bi bi-envelope text-muted me-1"></i>
                            {paciente.email}
                          </small>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info" className="rounded-pill">
                          {paciente.eps}
                        </Badge>
                      </td>
                      <td>
                        <Badge 
                          bg={paciente.estado === 'activo' ? 'success' : 'secondary'}
                          className="rounded-pill"
                        >
                          {paciente.estado === 'activo' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="rounded-pill"
                            onClick={() => navigate(`/pacientes/${paciente.id || paciente._id}`)}
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye"></i>
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="rounded-pill"
                            onClick={() => navigate(`/pacientes/editar/${paciente.id || paciente._id}`)}
                            title="Editar"
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-pill"
                            onClick={() => handleDelete(paciente)}
                            title="Eliminar"
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="empty-state py-5">
              <i className="bi bi-people"></i>
              <h4>No se encontraron pacientes</h4>
              <p>
                {busqueda 
                  ? 'No hay pacientes que coincidan con tu búsqueda'
                  : 'Comienza agregando tu primer paciente'}
              </p>
              {!busqueda && (
                <Button 
                  variant="primary"
                  className="rounded-pill mt-3"
                  onClick={() => navigate('/pacientes/nuevo')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Agregar Primer Paciente
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle text-warning me-2"></i>
            Confirmar Eliminación
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar al paciente{' '}
          <strong>
            {pacienteToDelete?.nombres} {pacienteToDelete?.apellidos}
          </strong>?
          <br />
          <small className="text-muted">Esta acción no se puede deshacer.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteModal(false)}
            className="rounded-pill"
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            className="rounded-pill"
          >
            <i className="bi bi-trash me-2"></i>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListaPacientes;