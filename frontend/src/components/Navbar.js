import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const NavbarComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className="py-1"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        minHeight: '60px'
      }}
    >
      <Container className="px-3">
        <Navbar.Brand as={Link} to="/" className="text-white d-flex align-items-center py-0">
          <i className="bi bi-hospital fs-4 me-2"></i>
          <div className="d-flex flex-column">
            <span className="fw-bold" style={{fontSize: '1.1rem', lineHeight: '1.2'}}>
              HealthAdmin Lite
            </span>
            <small style={{fontSize: '9px', opacity: 0.8, lineHeight: '1'}}>
              Sistema de Gestión Médica
            </small>
          </div>
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          className="border-0 py-1"
        >
          <span 
            className="navbar-toggler-icon" 
            style={{
              filter: 'invert(1)',
              width: '1.2em',
              height: '1.2em'
            }}
          ></span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link 
              as={Link} 
              to="/dashboard" 
              className={`text-white px-2 py-1 ${location.pathname === '/dashboard' ? 'fw-bold' : ''}`}
              style={{fontSize: '0.95rem'}}
            >
              <i className="bi bi-speedometer2 me-1"></i>
              Dashboard
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/pacientes" 
              className={`text-white px-2 py-1 ${location.pathname.includes('/pacientes') ? 'fw-bold' : ''}`}
              style={{fontSize: '0.95rem'}}
            >
              <i className="bi bi-people-fill me-1"></i>
              Pacientes
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/pacientes/nuevo" 
              className="px-2 py-1"
            >
              <button className="btn btn-light rounded-pill px-3 py-1" style={{fontSize: '0.85rem'}}>
                <i className="bi bi-plus-circle me-1"></i>
                Nuevo Paciente
              </button>
            </Nav.Link>

            {/* Usuario y Logout */}
            <div className="d-flex align-items-center ms-3">
              <span className="text-white me-3" style={{fontSize: '0.9rem'}}>
                <i className="bi bi-person-circle me-1"></i>
                {usuario?.nombre || 'Usuario'}
              </span>
              <button 
                onClick={handleLogout}
                className="btn btn-outline-light btn-sm rounded-pill px-3 py-1"
                style={{fontSize: '0.85rem'}}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Salir
              </button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;