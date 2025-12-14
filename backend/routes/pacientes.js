const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');
const auth = require('../middleware/auth');

// Obtener todos los pacientes
router.get('/', auth, async (req, res) => {
  try {
    const pacientes = await Paciente.find({ activo: true })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: pacientes,
      total: pacientes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener pacientes',
      error: error.message
    });
  }
});

// Obtener un paciente por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: paciente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener paciente',
      error: error.message
    });
  }
});

// Crear nuevo paciente
router.post('/', auth, async (req, res) => {
  try {
    const paciente = new Paciente(req.body);
    await paciente.save();
    
    res.status(201).json({
      success: true,
      message: 'Paciente creado exitosamente',
      data: paciente
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear paciente',
      error: error.message
    });
  }
});

// Actualizar paciente
router.put('/:id', auth, async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Paciente actualizado exitosamente',
      data: paciente
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar paciente',
      error: error.message
    });
  }
});

// Eliminar paciente (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Paciente eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar paciente',
      error: error.message
    });
  }
});

module.exports = router;