// Modelo de un usuario. Tiene los MISMOS nombres de campo que devuelve la API.
export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  tipo_documento: string;
  numero_documento: string;
  correo: string;
  celular: string | null;
  rol: string;
  estado: string;
}
