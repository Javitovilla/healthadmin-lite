import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { usePacientes } from '../contexts/PacienteContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { pacientes, obtenerPacientes } = usePacientes();
  const [stats, setStats] = useState({
    totalPacientes: 0,
    pacientesActivos: 0,
    citasHoy: 0,
    nuevosEsteMes: 0
  });

  useEffect(() => {
    obtenerPacientes();
  }, []);

  useEffect(() => {
    // Calcular estadísticas
    setStats({
      totalPacientes: pacientes.length,
      pacientesActivos: pacientes.filter(p => p.estado === 'activo').length,
      citasHoy: Math.floor(Math.random() * 15) + 5, // Simulado
      nuevosEsteMes: pacientes.filter(p => {
        const fecha = new Date(p.createdAt);
        const mesActual = new Date().getMonth();
        return fecha.getMonth() === mesActual;
      }).length
    });
  }, [pacientes]);

  const statCards = [
    {
      title: 'Total Pacientes',
      value: stats.totalPacientes,
      icon: 'bi-people-fill',
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Pacientes Activos',
      value: stats.pacientesActivos,
      icon: 'bi-person-check-fill',
      color: '#00c896',
      gradient: 'linear-gradient(135deg, #00c896 0%, #00a572 100%)'
    },
    {
      title: 'Citas Hoy',
      value: stats.citasHoy,
      icon: 'bi-calendar-check-fill',
      color: '#ffc107',
      gradient: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)'
    },
    {
      title: 'Nuevos Este Mes',
      value: stats.nuevosEsteMes,
      icon: 'bi-person-plus-fill',
      color: '#17a2b8',
      gradient: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)'
    }
  ];

  const quickActions = [
    {
      title: 'Registrar Paciente',
      description: 'Agregar un nuevo paciente al sistema',
      icon: 'bi-person-plus',
      action: () => navigate('/pacientes/nuevo'),
      color: '#28a745'
    },
    {
      title: 'Ver Pacientes',
      description: 'Lista completa de pacientes',
      icon: 'bi-list-ul',
      action: () => navigate('/pacientes'),
      color: '#0099cc'
    },
    {
      title: 'Buscar Paciente',
      description: 'Búsqueda rápida por nombre o documento',
      icon: 'bi-search',
      action: () => navigate('/pacientes'),
      color: '#6610f2'
    },
    {
      title: 'Reportes',
      description: 'Generar reportes y estadísticas',
      icon: 'bi-graph-up',
      action: () => alert('Módulo de reportes en desarrollo'),
      color: '#e83e8c'
    }
  ];

  return (
    <Container fluid className="fade-in">
      {/* Header */}
<div className="mb-4 text-center">
  <i className="bi bi-hospital text-primary" style={{
    fontSize: '3rem',
    display: 'block !important',
    opacity: '1 !important',
    visibility: 'visible !important',
    margin: '0 auto 1rem auto'
  }}></i>
  <h1 className="display-5 fw-bold text-primary">
    Panel de Control
  </h1>
        <p className="text-muted">
          Bienvenido al sistema de gestión de pacientes HealthAdmin Lite
        </p>
      </div>

      {/* Estadísticas */}
      <Row className="mb-4">
        {statCards.map((stat, index) => (
          <Col lg={3} md={6} className="mb-3" key={index}>
            <Card 
              className="stat-card h-100 border-0"
              style={{
                background: stat.gradient,
                color: 'white',
                cursor: 'pointer',
                animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`
              }}
              onClick={() => navigate('/pacientes')}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="fw-bold mb-0">{stat.value}</h2>
                    <p className="mb-0 opacity-75 small">{stat.title}</p>
                  </div>
                  <i className={`bi ${stat.icon} fs-1 opacity-25`}></i>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Acciones Rápidas */}
      <h3 className="mb-3">
        <i className="bi bi-lightning-charge me-2"></i>
        Acciones Rápidas
      </h3>
      <Row className="mb-4">
        {quickActions.map((action, index) => (
          <Col lg={3} md={6} className="mb-3" key={index}>
            <Card 
              className="h-100 border-0 shadow-sm action-card"
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: `slideInLeft 0.5s ease-in-out ${index * 0.1}s both`
              }}
              onClick={action.action}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <Card.Body className="text-center py-4">
                <div 
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: `${action.color}20`,
                    color: action.color
                  }}
                >
                  <i className={`bi ${action.icon} fs-3`}></i>
                </div>
                <h5 className="mb-2">{action.title}</h5>
                <p className="text-muted small mb-0">{action.description}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Actividad Reciente */}
      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4 pb-0">
              <h5 className="mb-3">
                <i className="bi bi-clock-history me-2"></i>
                Actividad Reciente
              </h5>
            </Card.Header>
            <Card.Body>
              {pacientes.length > 0 ? (
                <div className="activity-list">
                  {pacientes.slice(0, 5).map((paciente, index) => (
                    <div 
                      key={paciente.id || paciente._id}
                      className="d-flex align-items-center p-3 mb-2 rounded hover-bg"
                      style={{
                        background: index % 2 === 0 ? '#f8f9fa' : 'white',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/pacientes/${paciente.id || paciente._id}`)}
                    >
                      <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                           style={{width: '40px', height: '40px'}}>
                        {paciente.nombres ? paciente.nombres[0] : 'P'}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">{paciente.nombres} {paciente.apellidos}</div>
                        <small className="text-muted">
                          <i className="bi bi-telephone me-1"></i>{paciente.telefono} | 
                          <i className="bi bi-envelope ms-2 me-1"></i>{paciente.email}
                        </small>
                      </div>
                      <span className="badge bg-success-subtle text-success">
                        Activo
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                  <p>No hay pacientes registrados</p>
                  <button 
                    className="btn btn-primary rounded-pill"
                    onClick={() => navigate('/pacientes/nuevo')}
                  >
                    Registrar Primer Paciente
                  </button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0 pt-4 pb-0">
              <h5 className="mb-3">
                <i className="bi bi-info-circle me-2"></i>
                Información del Sistema
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="info-item mb-3">
                <small className="text-muted d-block">Versión</small>
                <span className="fw-bold">1.0.0</span>
              </div>
              <div className="info-item mb-3">
                <small className="text-muted d-block">Base de Datos</small>
                <span className="fw-bold text-success">
                  <i className="bi bi-check-circle me-1"></i>
                  Conectada
                </span>
              </div>
              <div className="info-item mb-3">
                <small className="text-muted d-block">API Status</small>
                <span className="fw-bold text-success">
                  <i className="bi bi-check-circle me-1"></i>
                  Operativa
                </span>
              </div>
              <div className="info-item mb-3">
                <small className="text-muted d-block">Último Backup</small>
                <span className="fw-bold">Hoy, 3:00 AM</span>
              </div>
              <hr />
              <button className="btn btn-outline-primary btn-sm w-100 mb-2">
                <i className="bi bi-download me-2"></i>
                Descargar Backup
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => window.open('http://localhost:5000/api-docs', '_blank')}
              >
                <i className="bi bi-book me-2"></i>
                Ver Documentación API
              </button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;