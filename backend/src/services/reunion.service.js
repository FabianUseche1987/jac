
 // =============================================================
 // reunion.service.js - Capa de lógica de negocio
 // Limpia y valida los datos antes de llamar al repositorio.
 // =============================================================

const reunionRepository = require('../repositories/reunion.repository');

// Valores exactos permitidos en los ENUM de MySQL
const TIPOS = [
  'ordinaria',
  'asamblea',
  'comite',
  'comunitaria'
];

const ESTADOS = [
  'programada',
  'realizada',
  'cancelada'
];

const ESTADOS_ASISTENCIA = [
  'presente',
  'ausente',
  'justificado'
];

// Genera errores HTTP
function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

// Normaliza el tipo de reunión
function normalizarTipo(tipo = '') {
  const valor = String(tipo).trim().toLowerCase();

  const equivalencias = {
    'ordinarias': 'ordinaria',
    'asambleas': 'asamblea',
    'comités': 'comite',
    'comites': 'comite',
    'reuniones comunitarias': 'comunitaria'
  };

  return equivalencias[valor] || valor;
}

// Normaliza el estado de la reunión
function normalizarEstado(estado = '') {
  const valor = String(estado).trim().toLowerCase();

  return valor === 'programado' ? 'programada' : valor;
}

// Limpia los datos de una reunión
function limpiar(datos = {}) {
  const texto = (valor) => String(valor ?? '').trim();

  return {
    titulo: texto(datos.titulo),
    descripcion: texto(datos.descripcion),
    tipo: normalizarTipo(datos.tipo || 'ordinaria'),
    fecha: texto(datos.fecha),
    hora: texto(datos.hora),
    lugar: texto(datos.lugar),
    estado: normalizarEstado(datos.estado || 'programada'),
    junta_id: datos.junta_id ? Number(datos.junta_id) : 1
  };
}

// Valida los datos de una reunión
function validar(reunion) {
  if (!reunion.titulo) {
    throw errorHttp(400, 'El título de la reunión es obligatorio');
  }

  if (reunion.titulo.length < 3) {
    throw errorHttp(400, 'El título debe tener al menos 3 caracteres');
  }

  if (!TIPOS.includes(reunion.tipo)) {
    throw errorHttp(400, `Tipo no válido. Use: ${TIPOS.join(', ')}`);
  }

  if (!reunion.fecha || !/^\d{4}-\d{2}-\d{2}$/.test(reunion.fecha)) {
    throw errorHttp(400, 'La fecha debe tener formato AAAA-MM-DD');
  }

  const fecha = new Date(`${reunion.fecha}T00:00:00`);

  if (
    Number.isNaN(fecha.getTime()) ||
    fecha.toISOString().slice(0, 10) !== reunion.fecha
  ) {
    throw errorHttp(400, 'La fecha de la reunión no es válida');
  }

  if (!/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(reunion.hora)) {
    throw errorHttp(400, 'La hora debe tener formato HH:MM o HH:MM:SS');
  }

  if (!reunion.lugar) {
    throw errorHttp(400, 'El lugar de la reunión es obligatorio');
  }

  if (!ESTADOS.includes(reunion.estado)) {
    throw errorHttp(400, `Estado no válido. Use: ${ESTADOS.join(', ')}`);
  }

  if (!Number.isInteger(reunion.junta_id) || reunion.junta_id <= 0) {
    throw errorHttp(400, 'El identificador de la junta no es válido');
  }
}

// Valida identificadores numéricos
function validarId(id) {
  const numero = Number(id);

  if (!Number.isInteger(numero) || numero <= 0) {
    throw errorHttp(400, 'El identificador proporcionado no es válido');
  }

  return numero;
}

// -------------------------------------------------------------
// OPERACIONES DE REUNIONES
// -------------------------------------------------------------

async function listar() {
  return reunionRepository.listar();
}

async function obtenerPorId(id) {
  id = validarId(id);

  const reunion = await reunionRepository.buscarPorId(id);

  if (!reunion) {
    throw errorHttp(404, 'Reunión no encontrada');
  }

  return reunion;
}

async function crear(datos) {
  const reunion = limpiar(datos);

  validar(reunion);

  const id = await reunionRepository.crear(reunion);

  return obtenerPorId(id);
}

async function actualizar(id, datos) {
  id = validarId(id);

  const reunion = limpiar(datos);

  validar(reunion);

  const existe = await reunionRepository.buscarPorId(id);

  if (!existe) {
    throw errorHttp(404, 'Reunión no encontrada');
  }

  await reunionRepository.actualizar(id, reunion);

  return obtenerPorId(id);
}

async function cambiarEstado(id, estado) {
  id = validarId(id);

  const estadoNormalizado = normalizarEstado(estado);

  if (!ESTADOS.includes(estadoNormalizado)) {
    throw errorHttp(400, `Estado no válido. Use: ${ESTADOS.join(', ')}`);
  }

  const existe = await reunionRepository.buscarPorId(id);

  if (!existe) {
    throw errorHttp(404, 'Reunión no encontrada');
  }

  await reunionRepository.cambiarEstado(id, estadoNormalizado);

  return obtenerPorId(id);
}

async function eliminar(id) {
  id = validarId(id);

  const existe = await reunionRepository.buscarPorId(id);

  if (!existe) {
    throw errorHttp(404, 'Reunión no encontrada');
  }

  await reunionRepository.eliminar(id);

  return { mensaje: 'Reunión eliminada exitosamente' };
}

// -------------------------------------------------------------
// OPERACIONES DE ASISTENCIA
// -------------------------------------------------------------

async function listarAsistentes(reunionId) {
  reunionId = validarId(reunionId);

  await obtenerPorId(reunionId);

  return reunionRepository.listarAsistentes(reunionId);
}

async function registrarAsistencia(datos = {}) {
  const reunionId = validarId(datos.reunion_id);
  const usuarioId = validarId(datos.usuario_id);

  const estado = String(
    datos.estado_asistencia || 'presente'
  ).trim().toLowerCase();

  const observacion = String(datos.observacion ?? '').trim();

  if (!ESTADOS_ASISTENCIA.includes(estado)) {
    throw errorHttp(
      400,
      `Estado de asistencia no válido. Use: ${ESTADOS_ASISTENCIA.join(', ')}`
    );
  }

  if (observacion.length > 5000) {
    throw errorHttp(400, 'La observación es demasiado extensa');
  }

  const reunion = await obtenerPorId(reunionId);

  if (reunion.estado === 'cancelada') {
    throw errorHttp(400, 'No se puede registrar asistencia en una reunión cancelada');
  }

  const asistencia = {
    reunion_id: reunionId,
    usuario_id: usuarioId,
    estado_asistencia: estado,
    observacion: observacion || null
  };

  try {
    const id = await reunionRepository.registrarAsistencia(asistencia);

    return {
      id,
      ...asistencia,
      mensaje: 'Asistencia registrada exitosamente'
    };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw errorHttp(409, 'Este usuario ya tiene un registro de asistencia en esta reunión');
    }

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      throw errorHttp(400, 'La reunión o el usuario no existen');
    }

    throw error;
  }
}

async function actualizarAsistencia(id, datos = {}) {
  id = validarId(id);

  const estado = String(
    datos.estado_asistencia || ''
  ).trim().toLowerCase();

  const observacion = String(datos.observacion ?? '').trim();

  if (!ESTADOS_ASISTENCIA.includes(estado)) {
    throw errorHttp(
      400,
      `Estado de asistencia no válido. Use: ${ESTADOS_ASISTENCIA.join(', ')}`
    );
  }

  if (observacion.length > 5000) {
    throw errorHttp(400, 'La observación es demasiado extensa');
  }

  const asistencia = {
    estado_asistencia: estado,
    observacion: observacion || null
  };

  const afectadas = await reunionRepository.actualizarAsistencia(id, asistencia);

  if (!afectadas) {
    throw errorHttp(404, 'Registro de asistencia no encontrado');
  }

  return { mensaje: 'Asistencia actualizada exitosamente' };
}

async function eliminarAsistencia(id) {
  id = validarId(id);

  const afectadas = await reunionRepository.eliminarAsistencia(id);

  if (!afectadas) {
    throw errorHttp(404, 'Registro de asistencia no encontrado');
  }

  return { mensaje: 'Registro de asistencia eliminado exitosamente' };
}

// -------------------------------------------------------------
// EXPORTACIÓN
// -------------------------------------------------------------

module.exports = {
  listar,
  obtenerPorId,
  crear,
  actualizar,
  cambiarEstado,
  eliminar,
  listarAsistentes,
  registrarAsistencia,
  actualizarAsistencia,
  eliminarAsistencia,
  TIPOS,
  ESTADOS,
  ESTADOS_ASISTENCIA
};
