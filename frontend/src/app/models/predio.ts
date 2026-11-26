export interface Predio {
  id: number;
  direccion: string;
  barrio: string;
  matricula_inmobiliaria: string;
  estrato: number;
  tipo_predio: 'residencial' | 'comercial' | 'lote' | 'comunitario';
  propietario: string;
  estado: 'activo' | 'inactivo';
  fecha_creacion?: string;
}
