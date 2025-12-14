import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PacienteProvider } from './contexts/PacienteContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
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
    <AuthProvider>
      <NotificationProvider>
        <PacienteProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Ruta pública - Login */}
                <Route path="/login" element={<Login />} />

                {/* Rutas protegidas */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                } />

                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="main-container">
                      <div className="container py-4">
                        <Dashboard />
                      </div>
                    </div>
                    <Footer />
                  </ProtectedRoute>
                } />

                <Route path="/pacientes" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="main-container">
                      <div className="container py-4">
                        <ListaPacientes />
                      </div>
                    </div>
                    <Footer />
                  </ProtectedRoute>
                } />

                <Route path="/pacientes/nuevo" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="main-container">
                      <div className="container py-4">
                        <FormularioPaciente />
                      </div>
                    </div>
                    <Footer />
                  </ProtectedRoute>
                } />

                <Route path="/pacientes/editar/:id" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="main-container">
                      <div className="container py-4">
                        <FormularioPaciente />
                      </div>
                    </div>
                    <Footer />
                  </ProtectedRoute>
                } />

                <Route path="/pacientes/:id" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="main-container">
                      <div className="container py-4">
                        <DetallePaciente />
                      </div>
                    </div>
                    <Footer />
                  </ProtectedRoute>
                } />

                <Route path="*" element={
                  <ProtectedRoute>
                    <Navbar />
                    <div className="main-container">
                      <div className="container py-4">
                        <NotFound />
                      </div>
                    </div>
                    <Footer />
                  </ProtectedRoute>
                } />
              </Routes>
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
    </AuthProvider>
  );
}

export default App;