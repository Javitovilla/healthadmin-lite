// seedPacientes.js - Script para poblar la base de datos con pacientes de prueba
const mongoose = require('mongoose');

// Esquema simplificado de Paciente
const pacienteSchema = new mongoose.Schema({
  tipoDocumento: String,
  numeroDocumento: String,
  nombres: String,
  apellidos: String,
  fechaNacimiento: Date,
  genero: String,
  telefono: String,
  email: String,
  direccion: String,
  ciudad: String,
  eps: String,
  grupoSanguineo: String,
  alergias: String,
  contactoEmergencia: {
    nombre: String,
    telefono: String,
    parentesco: String
  },
  estado: { type: String, default: 'activo' }
}, { timestamps: true });

const Paciente = mongoose.model('Paciente', pacienteSchema);

// Datos de prueba
const pacientesPrueba = [
  {
    tipoDocumento: 'CC',
    numeroDocumento: '1234567890',
    nombres: 'María José',
    apellidos: 'García Rodríguez',
    fechaNacimiento: new Date('1985-03-15'),
    genero: 'F',
    telefono: '3001234567',
    email: 'maria.garcia@email.com',
    direccion: 'Calle 100 # 15-20 Apto 301',
    ciudad: 'Bogotá',
    eps: 'Compensar',
    grupoSanguineo: 'O+',
    alergias: 'Penicilina',
    contactoEmergencia: {
      nombre: 'Carlos García',
      telefono: '3109876543',
      parentesco: 'Esposo'
    },
    estado: 'activo'
  },
  {
    tipoDocumento: 'CC',
    numeroDocumento: '9876543210',
    nombres: 'Juan Carlos',
    apellidos: 'Martínez López',
    fechaNacimiento: new Date('1978-07-22'),
    genero: 'M',
    telefono: '3112345678',
    email: 'juan.martinez@email.com',
    direccion: 'Carrera 7 # 45-67',
    ciudad: 'Bogotá',
    eps: 'Sanitas',
    grupoSanguineo: 'A+',
    alergias: 'Ninguna',
    contactoEmergencia: {
      nombre: 'Ana Martínez',
      telefono: '3201234567',
      parentesco: 'Hermana'
    },
    estado: 'activo'
  },
  {
    tipoDocumento: 'CC',
    numeroDocumento: '5555666777',
    nombres: 'Ana Lucía',
    apellidos: 'Pérez González',
    fechaNacimiento: new Date('1992-11-08'),
    genero: 'F',
    telefono: '3159876543',
    email: 'ana.perez@email.com',
    direccion: 'Avenida 19 # 120-45',
    ciudad: 'Bogotá',
    eps: 'Sura',
    grupoSanguineo: 'B+',
    alergias: 'Mariscos, Polen',
    contactoEmergencia: {
      nombre: 'Roberto Pérez',
      telefono: '3178901234',
      parentesco: 'Padre'
    },
    estado: 'activo'
  },
  {
    tipoDocumento: 'CC',
    numeroDocumento: '3333444555',
    nombres: 'Pedro Antonio',
    apellidos: 'Ramírez Herrera',
    fechaNacimiento: new Date('1980-05-30'),
    genero: 'M',
    telefono: '3004567890',
    email: 'pedro.ramirez@email.com',
    direccion: 'Diagonal 45 # 28-15',
    ciudad: 'Medellín',
    eps: 'Nueva EPS',
    grupoSanguineo: 'AB+',
    alergias: 'Aspirina',
    contactoEmergencia: {
      nombre: 'Laura Herrera',
      telefono: '3145678901',
      parentesco: 'Esposa'
    },
    estado: 'activo'
  },
  {
    tipoDocumento: 'TI',
    numeroDocumento: '1111222333',
    nombres: 'Sofía',
    apellidos: 'Rodríguez Silva',
    fechaNacimiento: new Date('2010-02-14'),
    genero: 'F',
    telefono: '3123456789',
    email: 'sofia.rodriguez@email.com',
    direccion: 'Calle 72 # 10-34',
    ciudad: 'Bogotá',
    eps: 'Famisanar',
    grupoSanguineo: 'O-',
    alergias: 'Ninguna',
    contactoEmergencia: {
      nombre: 'Carmen Silva',
      telefono: '3167890123',
      parentesco: 'Madre'
    },
    estado: 'activo'
  },
  {
    tipoDocumento: 'CC',
    numeroDocumento: '7777888999',
    nombres: 'Luis Fernando',
    apellidos: 'Torres Mendoza',
    fechaNacimiento: new Date('1975-09-18'),
    genero: 'M',
    telefono: '3189012345',
    email: 'luis.torres@email.com',
    direccion: 'Carrera 15 # 93-20',
    ciudad: 'Bogotá',
    eps: 'Compensar',
    grupoSanguineo: 'A-',
    alergias: 'Látex',
    contactoEmergencia: {
      nombre: 'Patricia Mendoza',
      telefono: '3190123456',
      parentesco: 'Prima'
    },
    estado: 'activo'
  },
  {
    tipoDocumento: 'CE',
    numeroDocumento: '999888777',
    nombres: 'Isabella',
    apellidos: 'Morales Díaz',
    fechaNacimiento: new Date('1988-12-25'),
    genero: 'F',
    telefono: '3134567890',
    email: 'isabella.morales@email.com',
    direccion: 'Calle 140 # 7-15 Torre 2 Apto 805',
    ciudad: 'Bogotá',
    eps: 'Sanitas',
    grupoSanguineo: 'B-',
    alergias: 'Ibuprofeno',
    contactoEmergencia: {
      nombre: 'Diego Díaz',
      telefono: '3156789012',
      parentesco: 'Hermano'
    },
    estado: 'activo'
  },
  {
    tipoDocumento: 'CC',
    numeroDocumento: '2222333444',
    nombres: 'Roberto Carlos',
    apellidos: 'Jiménez Castro',
    fechaNacimiento: new Date('1995-06-10'),
    genero: 'M',
    telefono: '3012345678',
    email: 'roberto.jimenez@email.com',
    direccion: 'Transversal 23 # 45-67',
    ciudad: 'Cali',
    eps: 'Coomeva',
    grupoSanguineo: 'O+',
    alergias: 'Ninguna',
    contactoEmergencia: {
      nombre: 'Martha Castro',
      telefono: '3023456789',
      parentesco: 'Madre'
    },
    estado: 'activo'
  },
  {
    tipoDocumento: 'CC',
    numeroDocumento: '6666777888',
    nombres: 'Carolina',
    apellidos: 'Vargas Ruiz',
    fechaNacimiento: new Date('1983-01-20'),
    genero: 'F',
    telefono: '3145678901',
    email: 'carolina.vargas@email.com',
    direccion: 'Avenida Boyacá # 68-45',
    ciudad: 'Bogotá',
    eps: 'Sura',
    grupoSanguineo: 'AB-',
    alergias: 'Anestesia local',
    contactoEmergencia: {
      nombre: 'Andrés Ruiz',
      telefono: '3167890123',
      parentesco: 'Esposo'
    },
    estado: 'activo'
  },
  {
    tipoDocumento: 'PA',
    numeroDocumento: 'AAA123456',
    nombres: 'Michael',
    apellidos: 'Johnson Smith',
    fechaNacimiento: new Date('1990-04-05'),
    genero: 'M',
    telefono: '3198765432',
    email: 'michael.johnson@email.com',
    direccion: 'Carrera 11 # 82-71',
    ciudad: 'Bogotá',
    eps: 'Compensar',
    grupoSanguineo: 'A+',
    alergias: 'Cacahuates',
    contactoEmergencia: {
      nombre: 'Sarah Smith',
      telefono: '3187654321',
      parentesco: 'Esposa'
    },
    estado: 'activo'
  }
];

// Función para poblar la base de datos
async function seedDatabase() {
  try {
    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/healthadmin-lite', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Conectado a MongoDB');
    
    // Limpiar colección existente (opcional)
    const count = await Paciente.countDocuments();
    if (count > 0) {
      console.log(`ℹ️  Ya existen ${count} pacientes en la base de datos`);
      const respuesta = process.argv[2]; // Pasar 'force' como argumento para forzar
      if (respuesta !== 'force') {
        console.log('❌ Cancelando operación. Usa "node seedPacientes.js force" para sobrescribir');
        process.exit(0);
      }
      await Paciente.deleteMany({});
      console.log('🗑️  Colección limpiada');
    }
    
    // Insertar pacientes de prueba
    const pacientesCreados = await Paciente.insertMany(pacientesPrueba);
    console.log(`✅ ${pacientesCreados.length} pacientes de prueba creados exitosamente`);
    
    // Mostrar resumen
    console.log('\n📊 Resumen de pacientes creados:');
    pacientesCreados.forEach((paciente, index) => {
      console.log(`${index + 1}. ${paciente.nombres} ${paciente.apellidos} - ${paciente.numeroDocumento}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('\n👋 Conexión cerrada');
    process.exit(0);
  }
}

// Ejecutar el script
seedDatabase();

// Para ejecutar este script:
// node seedPacientes.js        -> Solo agrega si la BD está vacía
// node seedPacientes.js force  -> Limpia la BD y agrega los pacientes de prueba