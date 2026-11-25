// Modelo que coincide con la tabla reuniones de MySQL.
export interface Reunion {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'ordinaria' | 'asamblea' | 'comite' | 'comunitaria' | string;
  fecha: string;
  hora: string;
  lugar: string;
  estado: 'programada' | 'realizada' | 'cancelada' | string;
  junta_id?: number;
  fecha_creacion?: string;
}
