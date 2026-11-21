// =============================================================
// proyecto.ts - Modelo de datos de Proyectos
// Estructura que coincide con la tabla proyectos de MySQL
// =============================================================
export interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  presupuesto: number;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado: 'propuesto' | 'en ejecucion' | 'finalizado' | 'cancelado' | string;
  junta_id?: number | null;
  fecha_creacion?: string;
}
