-- =============================================================
-- Base de Datos: JAC Connect
-- Estructura real de la tabla proyectos en MySQL
-- =============================================================

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
