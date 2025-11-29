import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PacienteProvider } from './contexts/PacienteContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import ListaPacientes from './components/ListaPacientes';
import FormularioPaciente from './components/FormularioPaciente';
import DetallePaciente from './components/DetallePaciente';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import './App.css';

/**
 * Componente principal de la aplicación HealthAdmin Lite
 * Implementa React Router para navegación y Context API para manejo de estado global
 */
function App() {
  return (
    <NotificationProvider>
      <PacienteProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
              <Routes>
                {/* Ruta raíz que redirige al dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Dashboard principal */}
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Rutas de pacientes */}
                <Route path="/pacientes" element={<ListaPacientes />} />
                <Route path="/pacientes/nuevo" element={<FormularioPaciente />} />
                <Route path="/pacientes/editar/:id" element={<FormularioPaciente />} />
                <Route path="/pacientes/:id" element={<DetallePaciente />} />
                
                {/* Ruta 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </Router>
      </PacienteProvider>
    </NotificationProvider>
  );
}

export default App;
