import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PacienteProvider } from './contexts/PacienteContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import ListaPacientes from './components/ListaPacientes';
import FormularioPaciente from './components/FormularioPaciente';
import DetallePaciente from './components/DetallePaciente';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <PacienteProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="main-container">
              <div className="container py-4">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/pacientes" element={<ListaPacientes />} />
                  <Route path="/pacientes/nuevo" element={<FormularioPaciente />} />
                  <Route path="/pacientes/editar/:id" element={<FormularioPaciente />} />
                  <Route path="/pacientes/:id" element={<DetallePaciente />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </PacienteProvider>
    </NotificationProvider>
  );
}

export default App;