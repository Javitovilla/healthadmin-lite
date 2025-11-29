import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h1>HealthAdmin Lite Dashboard</h1>
      <p>Bienvenido al sistema de gestión de pacientes</p>
      <div className="dashboard-cards">
        <div className="card" onClick={() => navigate('/pacientes')}>
          <h3>Pacientes</h3>
          <p>Gestionar pacientes del sistema</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;