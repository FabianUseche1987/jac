// =============================================================
// proyecto.service.js - Capa de lógica de negocio
// Limpia y valida los datos antes de llamar al repositorio.
// =============================================================
const proyectoRepository = require('../repositories/proyecto.repository');

// Estados exactos del ENUM de la tabla MySQL
const ESTADOS = ['propuesto', 'en ejecucion', 'finalizado', 'cancelado'];

function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

// Normaliza el estado para tolerar variaciones (ej: 'en_ejecucion' -> 'en ejecucion')
function normalizarEstado(estado = '') {
  const e = String(estado).trim().toLowerCase();
  if (e === 'en_ejecucion' || e === 'ejecucion' || e === 'en ejecucion') return 'en ejecucion';
  if (e === 'planificacion' || e === 'propuesto') return 'propuesto';
  if (e === 'completado' || e === 'finalizado') return 'finalizado';
  if (e === 'cancelado') return 'cancelado';
  return e;
}

function limpiar(datos = {}) {
  const texto = (valor) => String(valor ?? '').trim();
  const presupuestoNum = Number(datos.presupuesto);

  // Acepta tanto 'titulo' como 'nombre'
  const tituloFinal = texto(datos.titulo || datos.nombre);
  const estadoFinal = normalizarEstado(datos.estado || 'propuesto');

  return {
    titulo: tituloFinal,
    descripcion: texto(datos.descripcion),
    presupuesto: isNaN(presupuestoNum) ? 0 : Math.max(0, presupuestoNum),
    fecha_inicio: texto(datos.fecha_inicio) || null,
    fecha_fin: texto(datos.fecha_fin) || null,
    estado: estadoFinal,
    junta_id: datos.junta_id ? Number(datos.junta_id) : 1
  };
}

function validar(proyecto) {
  if (!proyecto.titulo) {
    throw errorHttp(400, 'El título del proyecto es obligatorio');
  }
  if (proyecto.titulo.length < 3) {
    throw errorHttp(400, 'El título debe tener al menos 3 caracteres');
  }
  if (!proyecto.descripcion) {
    throw errorHttp(400, 'La descripción es obligatoria');
  }
  if (!ESTADOS.includes(proyecto.estado)) {
    throw errorHttp(400, `Estado no válido. Use: ${ESTADOS.join(', ')}`);
  }
  if (proyecto.fecha_inicio && !/^\d{4}-\d{2}-\d{2}/.test(proyecto.fecha_inicio)) {
    throw errorHttp(400, 'La fecha de inicio debe tener formato AAAA-MM-DD');
  }
  if (proyecto.fecha_fin && !/^\d{4}-\d{2}-\d{2}/.test(proyecto.fecha_fin)) {
    throw errorHttp(400, 'La fecha de fin debe tener formato AAAA-MM-DD');
  }
  if (proyecto.fecha_inicio && proyecto.fecha_fin && proyecto.fecha_fin < proyecto.fecha_inicio) {
    throw errorHttp(400, 'La fecha de finalización no puede ser anterior a la de inicio');
  }
}

async function listar() {
  return proyectoRepository.listar();
}

async function obtenerPorId(id) {
  const proyecto = await proyectoRepository.buscarPorId(id);
  if (!proyecto) throw errorHttp(404, 'Proyecto no encontrado');
  return proyecto;
}

async function crear(datos) {
  const proyecto = limpiar(datos);
  validar(proyecto);
  const id = await proyectoRepository.crear(proyecto);
  return obtenerPorId(id);
}

async function actualizar(id, datos) {
  const proyecto = limpiar(datos);
  validar(proyecto);
  const existe = await proyectoRepository.buscarPorId(id);
  if (!existe) throw errorHttp(404, 'Proyecto no encontrado');
  await proyectoRepository.actualizar(id, proyecto);
  return obtenerPorId(id);
}

async function cambiarEstado(id, estado) {
  const estadoNormalizado = normalizarEstado(estado);
  if (!ESTADOS.includes(estadoNormalizado)) {
    throw errorHttp(400, `Estado no válido. Use: ${ESTADOS.join(', ')}`);
  }
  const existe = await proyectoRepository.buscarPorId(id);
  if (!existe) throw errorHttp(404, 'Proyecto no encontrado');
  await proyectoRepository.cambiarEstado(id, estadoNormalizado);
  return obtenerPorId(id);
}

async function eliminar(id) {
  const existe = await proyectoRepository.buscarPorId(id);
  if (!existe) throw errorHttp(404, 'Proyecto no encontrado');
  await proyectoRepository.eliminar(id);
  return { mensaje: 'Proyecto eliminado exitosamente' };
}

module.exports = { listar, obtenerPorId, crear, actualizar, cambiarEstado, eliminar, ESTADOS };
