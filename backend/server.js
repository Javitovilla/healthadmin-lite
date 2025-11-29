const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HealthAdmin Lite API',
      version: '1.0.0',
      description: 'API REST para gestión de pacientes en el sistema HealthAdmin',
      contact: {
        name: 'Javier Villa Ardila',
        email: 'javier@healthadmin.com'
      },
      servers: [{
        url: 'http://localhost:5000',
        description: 'Servidor de desarrollo'
      }]
    },
  },
  apis: ['./routes/*.js'], // Archivos que contienen anotaciones de Swagger
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/healthadmin-lite', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((err) => console.error('❌ Error conectando a MongoDB:', err));

// Importar rutas
const pacientesRoutes = require('./routes/pacientes');

// Usar rutas
app.use('/api/pacientes', pacientesRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a HealthAdmin Lite API',
    version: '1.0.0',
    documentacion: 'http://localhost:5000/api-docs'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo salió mal!',
    mensaje: err.message
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger en http://localhost:${PORT}/api-docs`);
});

module.exports = app;
