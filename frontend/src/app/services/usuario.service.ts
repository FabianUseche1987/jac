// Servicio que se comunica con la API de usuarios del backend
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';

@Injectable({ providedIn: 'root' }) // una sola instancia para toda la aplicación
export class UsuarioService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/api/usuarios';

  listar() {
    return this.http.get<Usuario[]>(this.url);
  }

  crear(usuario: Partial<Usuario>) {
    return this.http.post<Usuario>(this.url, usuario);
  }

  actualizar(id: number, usuario: Partial<Usuario>) {
    return this.http.put<Usuario>(`${this.url}/${id}`, usuario);
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.patch<Usuario>(`${this.url}/${id}/estado`, { estado });
  }
}
