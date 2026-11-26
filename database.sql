-- =============================================================
-- Base de Datos: JAC Connect
-- Estructura real de las tablas en MySQL
-- =============================================================

-- -------------------------------------------------------------
-- Tabla usuarios (módulo Gestión de usuarios)
-- Valores permitidos (los valida usuario.service.js):
--   tipo_documento: CC, TI, CE, PA
--   rol:            administrador, miembro, ciudadano
--   estado:         activo, inactivo (los usuarios no se borran,
--                   se desactivan para conservar su historial)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  tipo_documento VARCHAR(5) NOT NULL,
  numero_documento VARCHAR(20) NOT NULL UNIQUE,
  correo VARCHAR(150) NOT NULL UNIQUE,
  celular VARCHAR(20) NULL,
  rol VARCHAR(20) NOT NULL DEFAULT 'ciudadano',
  estado VARCHAR(10) NOT NULL DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -------------------------------------------------------------
-- Tabla proyectos (módulo Proyectos y avances)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS proyectos (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NOT NULL,
  presupuesto DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  fecha_inicio DATE NULL,
  fecha_fin DATE NULL,
  estado ENUM('propuesto', 'en ejecucion', 'finalizado', 'cancelado') NOT NULL DEFAULT 'propuesto',
  junta_id INT(11) NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------
-- Tabla reuniones (módulo Reuniones y asistencias)
-- La tabla asistencias_reunion y los datos de ejemplo están en
-- reuniones.sql (ejecútelo después de este archivo).
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reuniones (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT NULL,
  tipo ENUM('ordinaria', 'asamblea', 'comite', 'comunitaria') NOT NULL DEFAULT 'ordinaria',
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  lugar VARCHAR(200) NOT NULL,
  estado ENUM('programada', 'realizada', 'cancelada') NOT NULL DEFAULT 'programada',
  junta_id INT(11) NOT NULL DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- -------------------------------------------------------------
-- Tabla predios (módulo Predios o bienes comunales)
-- Campos tomados del formulario "Registrar Nuevo Predio".
-- Valores permitidos (los valida predio.service.js):
--   estrato:     1 a 6
--   tipo_predio: residencial, comercial, lote, comunitario
--   estado:      activo, inactivo
-- La matrícula inmobiliaria es única: el backend responde
-- "Ya existe un predio con esa matrícula inmobiliaria" si se repite.
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS predios (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  direccion VARCHAR(150) NOT NULL,
  barrio VARCHAR(100) NOT NULL,
  matricula_inmobiliaria VARCHAR(30) NOT NULL UNIQUE,
  estrato TINYINT NOT NULL DEFAULT 1 CHECK (estrato BETWEEN 1 AND 6),
  tipo_predio ENUM('residencial', 'comercial', 'lote', 'comunitario') NOT NULL DEFAULT 'residencial',
  propietario VARCHAR(150) NOT NULL,
  estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
