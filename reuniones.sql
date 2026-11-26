-- =============================================================
-- Script SQL del módulo de reuniones
-- Ejecute primero database.sql y luego este archivo.
-- =============================================================

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

CREATE TABLE IF NOT EXISTS asistencias_reunion (
  id INT(11) AUTO_INCREMENT PRIMARY KEY,
  reunion_id INT(11) NOT NULL,
  usuario_id INT(11) NOT NULL,
  estado_asistencia ENUM('presente', 'ausente', 'justificado') NOT NULL DEFAULT 'presente',
  observacion TEXT NULL,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_reunion_usuario (reunion_id, usuario_id),
  CONSTRAINT fk_asistencia_reunion
    FOREIGN KEY (reunion_id) REFERENCES reuniones(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_asistencia_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Datos de ejemplo basados en los campos del formulario Angular.
INSERT INTO reuniones
  (titulo, descripcion, tipo, fecha, hora, lugar, estado, junta_id)
VALUES
  (
    'Asamblea ordinaria mensual',
    'Revisión de actividades, novedades del barrio y plan de trabajo del mes.',
    'ordinaria',
    '2026-12-01',
    '18:30:00',
    'Salón comunal',
    'programada',
    1
  ),
  (
    'Asamblea extraordinaria de vecinos',
    'Definición de prioridades y presupuesto para mejoras comunitarias.',
    'asamblea',
    '2026-12-08',
    '19:00:00',
    'Casa de la cultura',
    'programada',
    1
  ),
  (
    'Comité de convivencia',
    'Seguimiento a iniciativas de seguridad y convivencia ciudadana.',
    'comite',
    '2026-11-20',
    '17:00:00',
    'Parque principal',
    'realizada',
    1
  ),
  (
    'Reunión comunitaria de obras',
    'Presentación de avances en la adecuación de espacios públicos.',
    'comunitaria',
    '2026-11-15',
    '16:00:00',
    'Cancha cubierta',
    'realizada',
    1
  ),
  (
    'Comité de cultura y deporte',
    'Organización de actividades recreativas para niños y jóvenes.',
    'comite',
    '2026-12-12',
    '15:30:00',
    'Biblioteca comunitaria',
    'programada',
    1
  ),
  (
    'Encuentro comunitario mensual',
    'Reunión cancelada por disponibilidad del espacio.',
    'comunitaria',
    '2026-11-25',
    '18:00:00',
    'Salón comunal',
    'cancelada',
    1
  );
