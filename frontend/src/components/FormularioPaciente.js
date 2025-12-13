import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { usePacientes } from '../contexts/PacienteContext';
import { toast } from 'react-toastify';

const FormularioPaciente = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { crearPaciente, actualizarPaciente, obtenerPacientePorId, loading } = usePacientes();
  
  const estadoInicial = {
    tipoDocumento: 'CC',
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    genero: 'M',
    telefono: '',
    email: '',
    direccion: '',
    ciudad: 'Bogotá',
    eps: '',
    grupoSanguineo: 'O+',
    alergias: 'Ninguna',
    contactoEmergencia: {
      nombre: '',
      telefono: '',
      parentesco: ''
    }
  };

  const [formData, setFormData] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (id) {
      cargarPaciente();
    }
  }, [id]);

  const cargarPaciente = useCallback(async () => {
    try {
      const paciente = await obtenerPacientePorId(id);
      if (paciente.fechaNacimiento) {
        paciente.fechaNacimiento = paciente.fechaNacimiento.split('T')[0];
      }
      setFormData(paciente);
    } catch (error) {
      toast.error('Error al cargar paciente');
      navigate('/pacientes');
    }
  }, [id, obtenerPacientePorId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('contacto.')) {
      const campo = name.split('.')[1];
      setFormData(prevState => ({
        ...prevState,
        contactoEmergencia: {
          ...prevState.contactoEmergencia,
          [campo]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    
    if (errores[name]) {
      setErrores(prevState => ({
        ...prevState,
        [name]: ''
      }));
    }
  };

  const validarFormulario = useMemo(() => {
    return () => {
      const nuevosErrores = {};
      
      if (!formData.numeroDocumento) {
        nuevosErrores.numeroDocumento = 'El número de documento es obligatorio';
      }
      if (!formData.nombres) {
        nuevosErrores.nombres = 'Los nombres son obligatorios';
      }
      if (!formData.apellidos) {
        nuevosErrores.apellidos = 'Los apellidos son obligatorios';
      }
      if (!formData.fechaNacimiento) {
        nuevosErrores.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
      }
      if (!formData.telefono) {
        nuevosErrores.telefono = 'El teléfono es obligatorio';
      } else if (!/^[0-9]{7,10}$/.test(formData.telefono)) {
        nuevosErrores.telefono = 'El teléfono debe tener entre 7 y 10 dígitos';
      }
      if (!formData.email) {
        nuevosErrores.email = 'El correo electrónico es obligatorio';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        nuevosErrores.email = 'El correo electrónico no es válido';
      }
      if (!formData.direccion) {
        nuevosErrores.direccion = 'La dirección es obligatoria';
      }
      if (!formData.eps) {
        nuevosErrores.eps = 'La EPS es obligatoria';
      }
      if (!formData.contactoEmergencia.nombre) {
        nuevosErrores['contacto.nombre'] = 'El nombre del contacto es obligatorio';
      }
      if (!formData.contactoEmergencia.telefono) {
        nuevosErrores['contacto.telefono'] = 'El teléfono del contacto es obligatorio';
      }
      if (!formData.contactoEmergencia.parentesco) {
        nuevosErrores['contacto.parentesco'] = 'El parentesco es obligatorio';
      }
      
      return nuevosErrores;
    };
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const form = e.currentTarget;
    setValidated(true);
    
    const erroresValidacion = validarFormulario();
    if (Object.keys(erroresValidacion).length > 0 || !form.checkValidity()) {
      setErrores(erroresValidacion);
      toast.error('Por favor complete todos los campos obligatorios');
      return;
    }
    
    setEnviando(true);
    
    try {
      if (id) {
        await actualizarPaciente(id, formData);
        toast.success('Paciente actualizado exitosamente');
      } else {
        await crearPaciente(formData);
        toast.success('Paciente creado exitosamente');
      }
      navigate('/pacientes');
    } catch (error) {
      toast.error(error.message || 'Error al guardar paciente');
    } finally {
      setEnviando(false);
    }
  };

  const edad = useMemo(() => {
    if (!formData.fechaNacimiento) return '';
    
    const hoy = new Date();
    const nacimiento = new Date(formData.fechaNacimiento);
    let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edadCalculada--;
    }
    
    return edadCalculada;
  }, [formData.fechaNacimiento]);

  if (loading && id) {
    return (
      <div className="loader-container">
        <div className="health-loader"></div>
      </div>
    );
  }

  return (
    <Container className="fade-in">
      <Row className="justify-content-center">
        <Col lg={10}>
          {/* Header */}
          <div className="mb-4">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/pacientes')}
              className="rounded-pill mb-3"
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver a Pacientes
            </Button>
            <h1 className="display-5 fw-bold text-primary">
              <i className={`bi bi-${id ? 'pencil-square' : 'person-plus'} me-3`}></i>
              {id ? 'Editar Paciente' : 'Nuevo Paciente'}
            </h1>
            {edad && (
              <Alert variant="info" className="mt-3">
                <i className="bi bi-info-circle me-2"></i>
                Edad del paciente: <strong>{edad} años</strong>
              </Alert>
            )}
          </div>

          {/* Formulario */}
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* Información Personal */}
            <Card className="custom-card mb-4">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <h5 className="mb-3">
                  <i className="bi bi-person-vcard me-2 text-primary"></i>
                  Información Personal
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Documento <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="tipoDocumento"
                        value={formData.tipoDocumento}
                        onChange={handleChange}
                        required
                      >
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PA">Pasaporte</option>
                        <option value="RC">Registro Civil</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número de Documento <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="numeroDocumento"
                        value={formData.numeroDocumento}
                        onChange={handleChange}
                        isInvalid={!!errores.numeroDocumento}
                        required
                        placeholder="12345678"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.numeroDocumento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombres <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleChange}
                        isInvalid={!!errores.nombres}
                        required
                        placeholder="Juan Carlos"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.nombres}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Apellidos <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleChange}
                        isInvalid={!!errores.apellidos}
                        required
                        placeholder="Pérez González"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.apellidos}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fecha de Nacimiento <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleChange}
                        isInvalid={!!errores.fechaNacimiento}
                        required
                        max={new Date().toISOString().split('T')[0]}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.fechaNacimiento}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Género <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="genero"
                        value={formData.genero}
                        onChange={handleChange}
                        required
                      >
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            {/* Información de Contacto */}
            <Card className="custom-card mb-4">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <h5 className="mb-3">
                  <i className="bi bi-telephone me-2 text-primary"></i>
                  Información de Contacto
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        isInvalid={!!errores.telefono}
                        required
                        placeholder="3001234567"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.telefono}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Correo Electrónico <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errores.email}
                        required
                        placeholder="correo@ejemplo.com"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dirección <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        isInvalid={!!errores.direccion}
                        required
                        placeholder="Calle 123 # 45-67"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.direccion}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ciudad <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        required
                        placeholder="Bogotá"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Información Médica */}
            <Card className="custom-card mb-4">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <h5 className="mb-3">
                  <i className="bi bi-heart-pulse me-2 text-primary"></i>
                  Información Médica
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>EPS <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="eps"
                        value={formData.eps}
                        onChange={handleChange}
                        isInvalid={!!errores.eps}
                        required
                        placeholder="Compensar"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.eps}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Grupo Sanguíneo <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="grupoSanguineo"
                        value={formData.grupoSanguineo}
                        onChange={handleChange}
                        required
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Alergias</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="alergias"
                        value={formData.alergias}
                        onChange={handleChange}
                        placeholder="Describa las alergias conocidas del paciente"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Contacto de Emergencia */}
            <Card className="custom-card mb-4">
              <Card.Header className="bg-white border-0 pt-4 pb-0">
                <h5 className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2 text-primary"></i>
                  Contacto de Emergencia
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="contacto.nombre"
                        value={formData.contactoEmergencia.nombre}
                        onChange={handleChange}
                        isInvalid={!!errores['contacto.nombre']}
                        required
                        placeholder="María González"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores['contacto.nombre']}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="tel"
                        name="contacto.telefono"
                        value={formData.contactoEmergencia.telefono}
                        onChange={handleChange}
                        isInvalid={!!errores['contacto.telefono']}
                        required
                        placeholder="3009876543"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores['contacto.telefono']}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Parentesco <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="contacto.parentesco"
                        value={formData.contactoEmergencia.parentesco}
                        onChange={handleChange}
                        isInvalid={!!errores['contacto.parentesco']}
                        required
                        placeholder="Esposa, Hijo, Madre, etc."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores['contacto.parentesco']}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2 mb-5">
              <Button
                variant="outline-secondary"
                className="rounded-pill px-4"
                onClick={() => navigate('/pacientes')}
                disabled={enviando}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="rounded-pill px-4"
                disabled={enviando || loading}
              >
                {enviando ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {id ? 'Actualizar' : 'Crear'} Paciente
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default FormularioPaciente;