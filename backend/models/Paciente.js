const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  tipoDocumento: {
    type: String,
    required: [true, 'El tipo de documento es obligatorio'],
    enum: ['CC', 'TI', 'CE', 'PA', 'RC'],
    default: 'CC'
  },
  numeroDocumento: {
    type: String,
    required: [true, 'El número de documento es obligatorio'],
    unique: true,
    trim: true,
    minlength: [5, 'El número de documento debe tener al menos 5 caracteres'],
    maxlength: [15, 'El número de documento no puede tener más de 15 caracteres']
  },
  nombres: {
    type: String,
    required: [true, 'Los nombres son obligatorios'],
    trim: true,
    minlength: [2, 'Los nombres deben tener al menos 2 caracteres'],
    maxlength: [50, 'Los nombres no pueden tener más de 50 caracteres']
  },
  apellidos: {
    type: String,
    required: [true, 'Los apellidos son obligatorios'],
    trim: true,
    minlength: [2, 'Los apellidos deben tener al menos 2 caracteres'],
    maxlength: [50, 'Los apellidos no pueden tener más de 50 caracteres']
  },
  fechaNacimiento: {
    type: Date,
    required: [true, 'La fecha de nacimiento es obligatoria'],
    validate: {
      validator: function(fecha) {
        return fecha <= new Date();
      },
      message: 'La fecha de nacimiento no puede ser futura'
    }
  },
  genero: {
    type: String,
    required: [true, 'El género es obligatorio'],
    enum: ['M', 'F', 'O'],
    default: 'M'
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true,
    match: [/^[0-9]{7,10}$/, 'Por favor ingrese un número de teléfono válido']
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un correo electrónico válido']
  },
  direccion: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true,
    minlength: [5, 'La dirección debe tener al menos 5 caracteres'],
    maxlength: [100, 'La dirección no puede tener más de 100 caracteres']
  },
  ciudad: {
    type: String,
    required: [true, 'La ciudad es obligatoria'],
    trim: true,
    default: 'Bogotá'
  },
  eps: {
    type: String,
    required: [true, 'La EPS es obligatoria'],
    trim: true
  },
  grupoSanguineo: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'El grupo sanguíneo es obligatorio']
  },
  alergias: {
    type: String,
    default: 'Ninguna',
    trim: true,
    maxlength: [500, 'Las alergias no pueden tener más de 500 caracteres']
  },
  contactoEmergencia: {
    nombre: {
      type: String,
      required: [true, 'El nombre del contacto de emergencia es obligatorio'],
      trim: true
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono del contacto de emergencia es obligatorio'],
      match: [/^[0-9]{7,10}$/, 'Por favor ingrese un número de teléfono válido']
    },
    parentesco: {
      type: String,
      required: [true, 'El parentesco es obligatorio'],
      trim: true
    }
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  versionKey: false
});

// Índices para mejorar el rendimiento
pacienteSchema.index({ numeroDocumento: 1 });
pacienteSchema.index({ email: 1 });
pacienteSchema.index({ nombres: 'text', apellidos: 'text' });

// Método para obtener el nombre completo
pacienteSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombres} ${this.apellidos}`;
});

// Método para calcular la edad
pacienteSchema.virtual('edad').get(function() {
  const hoy = new Date();
  const nacimiento = new Date(this.fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  
  return edad;
});

// Configurar el toJSON para incluir virtuals
pacienteSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;
