import { Component, inject, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Proyecto } from '../models/proyecto';
import { ProyectoService } from '../services/proyecto.service';

@Component({
  selector: 'app-proyectos',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.css'
})
export class Proyectos {
  private proyectoService = inject(ProyectoService);
  private fb = inject(FormBuilder);

  proyectos = signal<Proyecto[]>([]);
  editandoId = signal<number | null>(null); // null = creando, número = editando id
  mensajeError = signal('');
  mensajeExito = signal('');
  filtroEstado = signal<string>('todos');

  // Métricas calculadas automáticamente
  totalPresupuesto = computed(() => {
    return this.proyectos().reduce((total, p) => total + Number(p.presupuesto || 0), 0);
  });

  proyectosEnEjecucion = computed(() => {
    return this.proyectos().filter(p => p.estado === 'en ejecucion').length;
  });

  proyectosFinalizados = computed(() => {
    return this.proyectos().filter(p => p.estado === 'finalizado').length;
  });

  proyectosFiltrados = computed(() => {
    const estado = this.filtroEstado();
    if (estado === 'todos') return this.proyectos();
    return this.proyectos().filter(p => p.estado === estado);
  });

  // Formulario reactivo que coincide exactamente con las columnas de MySQL
  formulario = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    presupuesto: [0, [Validators.required, Validators.min(0)]],
    fecha_inicio: [''],
    fecha_fin: [''],
    estado: ['propuesto', Validators.required]
  });

  constructor() {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.proyectoService.listar().subscribe({
      next: (datos) => this.proyectos.set(datos),
      error: () => this.mensajeError.set('No se pudo conectar con el servidor para cargar los proyectos')
    });
  }

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.getRawValue();

    // Validar coherencia de fechas si ambas están diligenciadas
    if (datos.fecha_inicio && datos.fecha_fin && datos.fecha_fin < datos.fecha_inicio) {
      this.mensajeError.set('La fecha de finalización no puede ser menor a la fecha de inicio');
      return;
    }

    const id = this.editandoId();
    const peticion = id === null
      ? this.proyectoService.crear(datos)
      : this.proyectoService.actualizar(id, datos);

    peticion.subscribe({
      next: () => {
        this.cancelar();
        this.cargarProyectos();
        this.mensajeExito.set(id === null ? '¡Proyecto registrado con éxito!' : '¡Proyecto actualizado con éxito!');
        setTimeout(() => this.mensajeExito.set(''), 3500);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.mensaje ?? 'Error al comunicarse con el servidor');
      }
    });
  }

  editar(proyecto: Proyecto) {
    this.editandoId.set(proyecto.id);
    this.mensajeError.set('');
    this.mensajeExito.set('');

    const cortarFecha = (f: string | null) => (f ? f.substring(0, 10) : '');

    this.formulario.setValue({
      titulo: proyecto.titulo,
      descripcion: proyecto.descripcion,
      presupuesto: Number(proyecto.presupuesto) || 0,
      fecha_inicio: cortarFecha(proyecto.fecha_inicio),
      fecha_fin: cortarFecha(proyecto.fecha_fin),
      estado: proyecto.estado
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelar() {
    this.editandoId.set(null);
    this.mensajeError.set('');
    this.formulario.reset({
      titulo: '',
      descripcion: '',
      presupuesto: 0,
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'propuesto'
    });
  }

  cambiarEstado(proyecto: Proyecto, nuevoEstado: string) {
    this.proyectoService.cambiarEstado(proyecto.id, nuevoEstado).subscribe({
      next: () => {
        this.cargarProyectos();
        this.mensajeExito.set(`Estado actualizado a: ${this.obtenerEtiquetaEstado(nuevoEstado)}`);
        setTimeout(() => this.mensajeExito.set(''), 3000);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.mensaje ?? 'Error al actualizar el estado');
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás segura de eliminar este proyecto comunitario?')) {
      this.proyectoService.eliminar(id).subscribe({
        next: () => {
          this.cargarProyectos();
          this.mensajeExito.set('Proyecto eliminado correctamente');
          setTimeout(() => this.mensajeExito.set(''), 3000);
        },
        error: (err) => {
          this.mensajeError.set(err.error?.mensaje ?? 'Error al eliminar el proyecto');
        }
      });
    }
  }

  cambiarFiltro(nuevoEstado: string) {
    this.filtroEstado.set(nuevoEstado);
  }

  obtenerEtiquetaEstado(estado: string): string {
    switch (estado) {
      case 'propuesto': return 'Propuesto';
      case 'en ejecucion': return 'En Ejecución';
      case 'finalizado': return 'Finalizado';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  }

  obtenerClaseBadge(estado: string): string {
    switch (estado) {
      case 'propuesto': return 'bg-info text-dark';
      case 'en ejecucion': return 'bg-warning text-dark';
      case 'finalizado': return 'bg-success text-white';
      case 'cancelado': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor || 0);
  }
}
