// Servicio HTTP del módulo de reuniones.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reunion } from '../models/reunion';

@Injectable({ providedIn: 'root' })
export class ReunionService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/api/reuniones';

  listar() {
    return this.http.get<Reunion[]>(this.url);
  }

  obtenerPorId(id: number) {
    return this.http.get<Reunion>(`${this.url}/${id}`);
  }

  crear(reunion: Partial<Reunion>) {
    return this.http.post<Reunion>(this.url, reunion);
  }

  actualizar(id: number, reunion: Partial<Reunion>) {
    return this.http.put<Reunion>(`${this.url}/${id}`, reunion);
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.patch<Reunion>(`${this.url}/${id}/estado`, { estado });
  }

  eliminar(id: number) {
    return this.http.delete<{ mensaje: string }>(`${this.url}/${id}`);
  }
}
