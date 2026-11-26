// =============================================================
// predio.service.js - Capa de lógica de negocio
// =============================================================
const predioRepository = require('../repositories/predio.repository');

const ESTADOS = ['activo', 'inactivo'];
const TIPOS = ['residencial', 'comercial', 'lote', 'comunitario'];

function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

function limpiar(datos = {}) {
  const texto = (valor) => String(valor ?? '').trim();
  const estratoNum = Number(datos.estrato);

  return {
    direccion: texto(datos.direccion),
    barrio: texto(datos.barrio),
    matricula_inmobiliaria: texto(datos.matricula_inmobiliaria),
    estrato: isNaN(estratoNum) ? 1 : Math.min(6, Math.max(1, estratoNum)),
    tipo_predio: TIPOS.includes(texto(datos.tipo_predio).toLowerCase())
      ? texto(datos.tipo_predio).toLowerCase()
      : 'residencial',
    propietario: texto(datos.propietario),
    estado: ESTADOS.includes(texto(datos.estado).toLowerCase())
      ? texto(datos.estado).toLowerCase()
      : 'activo'
  };
}

function validar(predio) {
  if (!predio.direccion) {
    throw errorHttp(400, 'La dirección del predio es obligatoria');
  }
  if (!predio.barrio) {
    throw errorHttp(400, 'El barrio es obligatorio');
  }
  if (!predio.matricula_inmobiliaria) {
    throw errorHttp(400, 'La matrícula inmobiliaria es obligatoria');
  }
  if (!predio.propietario) {
    throw errorHttp(400, 'El nombre del propietario es obligatorio');
  }
}

async function listar() {
  return predioRepository.listar();
}

async function obtenerPorId(id) {
  const predio = await predioRepository.buscarPorId(id);
  if (!predio) throw errorHttp(404, 'Predio no encontrado');
  return predio;
}

async function crear(datos) {
  const predio = limpiar(datos);
  validar(predio);
  try {
    const id = await predioRepository.crear(predio);
    return obtenerPorId(id);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw errorHttp(409, 'Ya existe un predio con esa matrícula inmobiliaria');
    }
    throw error;
  }
}

async function actualizar(id, datos) {
  const predio = limpiar(datos);
  validar(predio);
  const existe = await predioRepository.buscarPorId(id);
  if (!existe) throw errorHttp(404, 'Predio no encontrado');
  try {
    await predioRepository.actualizar(id, predio);
    return obtenerPorId(id);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw errorHttp(409, 'Ya existe otro predio con esa matrícula inmobiliaria');
    }
    throw error;
  }
}

async function cambiarEstado(id, estado) {
  const estadoNorm = String(estado ?? '').trim().toLowerCase();
  if (!ESTADOS.includes(estadoNorm)) {
    throw errorHttp(400, `Estado no válido. Use: ${ESTADOS.join(', ')}`);
  }
  const existe = await predioRepository.buscarPorId(id);
  if (!existe) throw errorHttp(404, 'Predio no encontrado');
  await predioRepository.cambiarEstado(id, estadoNorm);
  return obtenerPorId(id);
}

async function eliminar(id) {
  const existe = await predioRepository.buscarPorId(id);
  if (!existe) throw errorHttp(404, 'Predio no encontrado');
  await predioRepository.eliminar(id);
  return { mensaje: 'Predio eliminado exitosamente' };
}

module.exports = { listar, obtenerPorId, crear, actualizar, cambiarEstado, eliminar, ESTADOS, TIPOS };
