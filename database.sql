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
