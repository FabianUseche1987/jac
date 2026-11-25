import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reunion } from '../models/reunion';
import { ReunionService } from '../services/reunion.service';

@Component({
  selector: 'app-reuniones',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './reuniones.html',
  styleUrl: './reuniones.css'
})
export class Reuniones {
  private reunionService = inject(ReunionService);
  private fb = inject(FormBuilder);

  reuniones = signal<Reunion[]>([]);
  editandoId = signal<number | null>(null);
  mensajeError = signal('');
  mensajeExito = signal('');
  filtroEstado = signal<string>('todos');

  reunionesProgramadas = computed(() =>
    this.reuniones().filter(reunion => reunion.estado === 'programada').length
  );

  reunionesRealizadas = computed(() =>
    this.reuniones().filter(reunion => reunion.estado === 'realizada').length
  );

  reunionesCanceladas = computed(() =>
    this.reuniones().filter(reunion => reunion.estado === 'cancelada').length
  );

  reunionesFiltradas = computed(() => {
    const estado = this.filtroEstado();
    if (estado === 'todos') return this.reuniones();
    return this.reuniones().filter(reunion => reunion.estado === estado);
  });

  formulario = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    tipo: ['ordinaria', Validators.required],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    lugar: ['', Validators.required],
    estado: ['programada', Validators.required],
    junta_id: [1, [Validators.required, Validators.min(1)]]
  });

  constructor() {
    this.cargarReuniones();
  }

  cargarReuniones() {
    this.reunionService.listar().subscribe({
      next: datos => this.reuniones.set(datos),
      error: () => this.mensajeError.set('No se pudo conectar con el servidor para cargar las reuniones')
    });
  }

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.getRawValue();
    const id = this.editandoId();
    const peticion = id === null
      ? this.reunionService.crear(datos)
      : this.reunionService.actualizar(id, datos);

    peticion.subscribe({
      next: () => {
        this.cancelar();
        this.cargarReuniones();
        this.mensajeExito.set(id === null
          ? '¡Reunión registrada con éxito!'
          : '¡Reunión actualizada con éxito!');
        setTimeout(() => this.mensajeExito.set(''), 3500);
      },
      error: err => this.mensajeError.set(err.error?.mensaje ?? 'Error al comunicarse con el servidor')
    });
  }

  editar(reunion: Reunion) {
    this.editandoId.set(reunion.id);
    this.mensajeError.set('');
    this.mensajeExito.set('');

    this.formulario.setValue({
      titulo: reunion.titulo,
      descripcion: reunion.descripcion ?? '',
      tipo: reunion.tipo,
      fecha: reunion.fecha ? reunion.fecha.substring(0, 10) : '',
      hora: reunion.hora ? reunion.hora.substring(0, 5) : '',
      lugar: reunion.lugar,
      estado: reunion.estado,
      junta_id: reunion.junta_id ?? 1
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelar() {
    this.editandoId.set(null);
    this.mensajeError.set('');
    this.formulario.reset({
      titulo: '',
      descripcion: '',
      tipo: 'ordinaria',
      fecha: '',
      hora: '',
      lugar: '',
      estado: 'programada',
      junta_id: 1
    });
  }

  cambiarEstado(reunion: Reunion, nuevoEstado: string) {
    this.reunionService.cambiarEstado(reunion.id, nuevoEstado).subscribe({
      next: () => {
        this.cargarReuniones();
        this.mensajeExito.set(`Estado actualizado a: ${this.obtenerEtiquetaEstado(nuevoEstado)}`);
        setTimeout(() => this.mensajeExito.set(''), 3000);
      },
      error: err => this.mensajeError.set(err.error?.mensaje ?? 'Error al actualizar el estado')
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de eliminar esta reunión?')) {
      this.reunionService.eliminar(id).subscribe({
        next: () => {
          this.cargarReuniones();
          this.mensajeExito.set('Reunión eliminada correctamente');
          setTimeout(() => this.mensajeExito.set(''), 3000);
        },
        error: err => this.mensajeError.set(err.error?.mensaje ?? 'Error al eliminar la reunión')
      });
    }
  }

  cambiarFiltro(nuevoEstado: string) {
    this.filtroEstado.set(nuevoEstado);
  }

  obtenerEtiquetaTipo(tipo: string): string {
    const etiquetas: Record<string, string> = {
      ordinaria: 'Ordinaria',
      asamblea: 'Asamblea',
      comite: 'Comité',
      comunitaria: 'Comunitaria'
    };
    return etiquetas[tipo] ?? tipo;
  }

  obtenerEtiquetaEstado(estado: string): string {
    const etiquetas: Record<string, string> = {
      programada: 'Programada',
      realizada: 'Realizada',
      cancelada: 'Cancelada'
    };
    return etiquetas[estado] ?? estado;
  }

  obtenerClaseBadge(estado: string): string {
    switch (estado) {
      case 'programada': return 'bg-primary text-white';
      case 'realizada': return 'bg-success text-white';
      case 'cancelada': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '—';
    const valor = new Date(`${fecha.substring(0, 10)}T00:00:00`);
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(valor);
  }
}
