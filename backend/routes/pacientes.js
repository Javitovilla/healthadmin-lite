const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');

/**
 * @swagger
 * components:
 *   schemas:
 *     Paciente:
 *       type: object
 *       required:
 *         - tipoDocumento
 *         - numeroDocumento
 *         - nombres
 *         - apellidos
 *         - fechaNacimiento
 *         - genero
 *         - telefono
 *         - email
 *         - direccion
 *         - ciudad
 *         - eps
 *         - grupoSanguineo
 *         - contactoEmergencia
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del paciente
 *         tipoDocumento:
 *           type: string
 *           enum: [CC, TI, CE, PA, RC]
 *           description: Tipo de documento de identidad
 *         numeroDocumento:
 *           type: string
 *           description: Número de documento único
 *         nombres:
 *           type: string
 *           description: Nombres del paciente
 *         apellidos:
 *           type: string
 *           description: Apellidos del paciente
 *         fechaNacimiento:
 *           type: string
 *           format: date
 *           description: Fecha de nacimiento
 *         genero:
 *           type: string
 *           enum: [M, F, O]
 *           description: Género del paciente
 *         telefono:
 *           type: string
 *           description: Teléfono de contacto
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico
 *         direccion:
 *           type: string
 *           description: Dirección de residencia
 *         ciudad:
 *           type: string
 *           description: Ciudad de residencia
 *         eps:
 *           type: string
 *           description: EPS afiliada
 *         grupoSanguineo:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *           description: Grupo sanguíneo
 *         alergias:
 *           type: string
 *           description: Alergias conocidas
 *         contactoEmergencia:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             telefono:
 *               type: string
 *             parentesco:
 *               type: string
 *         estado:
 *           type: string
 *           enum: [activo, inactivo]
 *           description: Estado del paciente en el sistema
 *         nombreCompleto:
 *           type: string
 *           description: Nombre completo del paciente
 *         edad:
 *           type: number
 *           description: Edad calculada del paciente
 *       example:
 *         tipoDocumento: CC
 *         numeroDocumento: "1234567890"
 *         nombres: Juan Carlos
 *         apellidos: Pérez González
 *         fechaNacimiento: 1990-05-15
 *         genero: M
 *         telefono: "3001234567"
 *         email: juan.perez@email.com
 *         direccion: Calle 123 # 45-67
 *         ciudad: Bogotá
 *         eps: Compensar
 *         grupoSanguineo: O+
 *         alergias: Ninguna
 *         contactoEmergencia:
 *           nombre: María González
 *           telefono: "3009876543"
 *           parentesco: Esposa
 */

/**
 * @swagger
 * tags:
 *   name: Pacientes
 *   description: API para gestión de pacientes en HealthAdmin Lite
 */

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Obtiene todos los pacientes
 *     tags: [Pacientes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de resultados por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda por nombre o documento
 *     responses:
 *       200:
 *         description: Lista de pacientes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Paciente'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     pages:
 *                       type: number
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (search) {
      query = {
        $or: [
          { nombres: { $regex: search, $options: 'i' } },
          { apellidos: { $regex: search, $options: 'i' } },
          { numeroDocumento: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const total = await Paciente.countDocuments(query);
    const pacientes = await Paciente.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: pacientes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/pacientes/{id}:
 *   get:
 *     summary: Obtiene un paciente por ID
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Paciente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Paciente'
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        error: 'Paciente no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: paciente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/pacientes:
 *   post:
 *     summary: Crea un nuevo paciente
 *     tags: [Pacientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       201:
 *         description: Paciente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Paciente'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/', async (req, res) => {
  try {
    const paciente = new Paciente(req.body);
    await paciente.save();
    
    res.status(201).json({
      success: true,
      data: paciente,
      message: 'Paciente creado exitosamente'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'El documento o email ya existe en el sistema'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/pacientes/{id}:
 *   put:
 *     summary: Actualiza un paciente existente
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del paciente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paciente'
 *     responses:
 *       200:
 *         description: Paciente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Paciente'
 *                 message:
 *                   type: string
 *       404:
 *         description: Paciente no encontrado
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        error: 'Paciente no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: paciente,
      message: 'Paciente actualizado exitosamente'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'El documento o email ya existe en el sistema'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: errors.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/pacientes/{id}:
 *   delete:
 *     summary: Elimina un paciente (cambio de estado a inactivo)
 *     tags: [Pacientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del paciente
 *     responses:
 *       200:
 *         description: Paciente eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Paciente no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndUpdate(
      req.params.id,
      { estado: 'inactivo' },
      { new: true }
    );
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        error: 'Paciente no encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Paciente eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
