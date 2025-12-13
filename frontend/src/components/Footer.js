import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer 
      className="mt-5 py-4 text-white"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 -2px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Container>
        <div className="text-center">
          <p className="mb-2">
            <i className="bi bi-hospital me-2"></i>
            <strong>HealthAdmin Lite</strong> - Sistema de Gestión de Pacientes
          </p>
          <p className="mb-1 small">
            Desarrollado por Javier Villa Ardila | Ingeniería de Software
          </p>
          <p className="mb-0 small opacity-75">
            © 2025 Corporación Universitaria Iberoamericana - Todos los derechos reservados
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;