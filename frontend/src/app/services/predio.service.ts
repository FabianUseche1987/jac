import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Predio } from '../models/predio';

@Injectable({ providedIn: 'root' })
export class PredioService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/api/predios';

  listar() {
    return this.http.get<Predio[]>(this.url);
  }

  obtenerPorId(id: number) {
    return this.http.get<Predio>(`${this.url}/${id}`);
  }

  crear(predio: Partial<Predio>) {
    return this.http.post<Predio>(this.url, predio);
  }

  actualizar(id: number, predio: Partial<Predio>) {
    return this.http.put<Predio>(`${this.url}/${id}`, predio);
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.patch<Predio>(`${this.url}/${id}/estado`, { estado });
  }

  eliminar(id: number) {
    return this.http.delete<{ mensaje: string }>(`${this.url}/${id}`);
  }
}
