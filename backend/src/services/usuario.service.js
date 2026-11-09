// =============================================================
// usuario.service.js - Capa de lógica de negocio
// Limpia y valida los datos antes de llamar al repositorio.
// =============================================================
const usuarioRepository = require('../repositories/usuario.repository');

// Valores permitidos (reglas de negocio del módulo)
const ROLES = ['administrador', 'miembro', 'ciudadano'];
const TIPOS_DOCUMENTO = ['CC', 'TI', 'CE', 'PA'];
const ESTADOS = ['activo', 'inactivo'];

// Crea un error con código HTTP para que el controlador sepa qué responder
function errorHttp(status, mensaje) {
  const error = new Error(mensaje);
  error.status = status;
  return error;
}

// Quita espacios sobrantes y deja SOLO los campos que se pueden guardar
function limpiar(datos = {}) {
  const texto = (valor) => String(valor ?? '').trim();
  return {
    nombres: texto(datos.nombres),
    apellidos: texto(datos.apellidos),
    tipo_documento: texto(datos.tipo_documento),
    numero_documento: texto(datos.numero_documento),
    correo: texto(datos.correo).toLowerCase(),
    celular: texto(datos.celular) || null, // si viene vacío se guarda NULL
    rol: texto(datos.rol)
  };
}

// Revisa las reglas. Si algo está mal, lanza un error 400 (petición incorrecta)
function validar(usuario) {
  if (!usuario.nombres || !usuario.apellidos || !usuario.numero_documento || !usuario.correo) {
    throw errorHttp(400, 'Nombres, apellidos, número de documento y correo son obligatorios');
  }
  if (!TIPOS_DOCUMENTO.includes(usuario.tipo_documento)) {
    throw errorHttp(400, 'Tipo de documento no válido. Use: CC, TI, CE o PA');
  }
  if (!ROLES.includes(usuario.rol)) {
    throw errorHttp(400, 'Rol no válido. Use: administrador, miembro o ciudadano');
  }
  if (!/^\S+@\S+\.\S+$/.test(usuario.correo)) {
    throw errorHttp(400, 'El correo no tiene un formato válido');
  }
}

// Si MySQL rechaza un dato repetido (UNIQUE), lo traduce a un mensaje claro (409 = conflicto)
function revisarDuplicado(error) {
  if (error.code === 'ER_DUP_ENTRY') {
    throw errorHttp(409, 'Ya existe un usuario con ese número de documento o correo');
  }
  throw error; // cualquier otro error sigue su camino
}

async function listar() {
  return usuarioRepository.listar();
}

async function obtenerPorId(id) {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) throw errorHttp(404, 'Usuario no encontrado');
  return usuario;
}

async function crear(datos) {
  const usuario = limpiar(datos);
  validar(usuario);
  const id = await usuarioRepository.crear(usuario).catch(revisarDuplicado);
  return obtenerPorId(id); // devuelve el usuario tal como quedó guardado
}

async function actualizar(id, datos) {
  const usuario = limpiar(datos);
  validar(usuario);
  const filas = await usuarioRepository.actualizar(id, usuario).catch(revisarDuplicado);
  if (filas === 0) throw errorHttp(404, 'Usuario no encontrado');
  return obtenerPorId(id);
}

async function cambiarEstado(id, estado) {
  if (!ESTADOS.includes(estado)) {
    throw errorHttp(400, 'Estado no válido. Use: activo o inactivo');
  }
  const filas = await usuarioRepository.cambiarEstado(id, estado);
  if (filas === 0) throw errorHttp(404, 'Usuario no encontrado');
  return obtenerPorId(id);
}

module.exports = { listar, obtenerPorId, crear, actualizar, cambiarEstado };
