const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthadmin-lite';

const crearAdmin = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const adminExistente = await Usuario.findOne({ email: 'admin@healthadmin.com' });
    
    if (adminExistente) {
      console.log('⚠️  Usuario admin ya existe');
      console.log('📧 Email:', adminExistente.email);
      console.log('👤 Nombre:', adminExistente.nombre);
      await mongoose.connection.close();
      return;
    }

    const admin = new Usuario({
      nombre: 'Administrador',
      email: 'admin@healthadmin.com',
      password: 'admin123',
      rol: 'admin',
      activo: true
    });

    await admin.save();

    console.log('');
    console.log('✅ Usuario administrador creado exitosamente');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:     admin@healthadmin.com');
    console.log('🔑 Password:  admin123');
    console.log('👤 Rol:       admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    await mongoose.connection.close();
    console.log('👋 Conexión cerrada');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

crearAdmin();