const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthadmin-lite';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Importar rutas
const authRoutes = require('./routes/auth');
const pacientesRoutes = require('./routes/pacientes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API HealthAdmin Lite',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        verificar: 'POST /api/auth/verificar'
      },
      pacientes: {
        listar: 'GET /api/pacientes',
        obtener: 'GET /api/pacientes/:id',
        crear: 'POST /api/pacientes',
        actualizar: 'PUT /api/pacientes/:id',
        eliminar: 'DELETE /api/pacientes/:id'
      }
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada' 
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
  console.log(`👥 Pacientes: http://localhost:${PORT}/api/pacientes`);
});