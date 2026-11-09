import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../models/usuario';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios {
  private usuarioService = inject(UsuarioService);
  private fb = inject(FormBuilder);

  usuarios = signal<Usuario[]>([]);
  editandoId = signal<number | null>(null); // null = creando, un número = editando ese usuario
  mensajeError = signal('');

  // Campos del formulario: [valor inicial, validaciones]
  formulario = this.fb.nonNullable.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    tipo_documento: ['CC', Validators.required],
    numero_documento: ['', [Validators.required, Validators.minLength(5)]],
    correo: ['', [Validators.required, Validators.email]],
    celular: ['', Validators.pattern(/^[0-9]{10}$/)], // opcional, pero si se escribe: 10 dígitos
    rol: ['ciudadano', Validators.required]
  });

  constructor() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.listar().subscribe(datos => this.usuarios.set(datos));
  }

  // Crea o actualiza, según si hay un usuario en edición
  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched(); // pinta de rojo los campos con error
      return;
    }

    const datos = this.formulario.getRawValue();
    const id = this.editandoId();
    const peticion = id === null
      ? this.usuarioService.crear(datos)
      : this.usuarioService.actualizar(id, datos);

    peticion.subscribe({
      next: () => {
        this.cancelar();       // limpia el formulario
        this.cargarUsuarios(); // recarga la tabla
      },
      // Muestra el mensaje del backend (ej: "Ya existe un usuario...")
      error: (err) => this.mensajeError.set(err.error?.mensaje ?? 'No se pudo conectar con el servidor')
    });
  }

  // Copia los datos de la fila al formulario para editarlos
  editar(usuario: Usuario) {
    this.editandoId.set(usuario.id);
    this.mensajeError.set('');
    this.formulario.setValue({
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      tipo_documento: usuario.tipo_documento,
      numero_documento: usuario.numero_documento,
      correo: usuario.correo,
      celular: usuario.celular ?? '',
      rol: usuario.rol
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // sube hasta el formulario
  }

  // Deja el formulario vacío y en modo "crear"
  cancelar() {
    this.editandoId.set(null);
    this.mensajeError.set('');
    this.formulario.reset(); // vuelve a los valores iniciales
  }
}
