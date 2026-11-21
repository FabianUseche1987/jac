// =============================================================
// proyecto.service.ts - Servicio HTTP
// Se comunica con la API de proyectos del backend usando HttpClient.
// =============================================================
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Proyecto } from '../models/proyecto';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/api/proyectos';

  listar() {
    return this.http.get<Proyecto[]>(this.url);
  }

  obtenerPorId(id: number) {
    return this.http.get<Proyecto>(`${this.url}/${id}`);
  }

  crear(proyecto: Partial<Proyecto>) {
    return this.http.post<Proyecto>(this.url, proyecto);
  }

  actualizar(id: number, proyecto: Partial<Proyecto>) {
    return this.http.put<Proyecto>(`${this.url}/${id}`, proyecto);
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.patch<Proyecto>(`${this.url}/${id}/estado`, { estado });
  }

  eliminar(id: number) {
    return this.http.delete<{ mensaje: string }>(`${this.url}/${id}`);
  }
}
