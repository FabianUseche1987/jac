import { Component, inject, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Predio } from '../models/predio';
import { PredioService } from '../services/predio.service';

@Component({
  selector: 'app-predios',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './predios.html',
  styleUrl: './predios.css'
})
export class Predios {
  private predioService = inject(PredioService);
  private fb = inject(FormBuilder);

  predios = signal<Predio[]>([]);
  editandoId = signal<number | null>(null);
  mensajeError = signal('');
  mensajeExito = signal('');
  filtroEstado = signal<string>('todos');

  totalPredios = computed(() => this.predios().length);
  prediosActivos = computed(() => this.predios().filter(p => p.estado === 'activo').length);
  prediosInactivos = computed(() => this.predios().filter(p => p.estado === 'inactivo').length);

  prediosFiltrados = computed(() => {
    const estado = this.filtroEstado();
    if (estado === 'todos') return this.predios();
    return this.predios().filter(p => p.estado === estado);
  });

  formulario = this.fb.nonNullable.group({
    direccion: ['', [Validators.required, Validators.minLength(3)]],
    barrio: ['', [Validators.required, Validators.minLength(3)]],
    matricula_inmobiliaria: ['', [Validators.required, Validators.minLength(3)]],
    estrato: [1, [Validators.required, Validators.min(1), Validators.max(6)]],
    tipo_predio: ['residencial' as Predio['tipo_predio'], Validators.required],
    propietario: ['', [Validators.required, Validators.minLength(3)]],
    estado: ['activo' as Predio['estado'], Validators.required]
  });

  constructor() {
    this.cargarPredios();
  }

  cargarPredios() {
    this.predioService.listar().subscribe({
      next: (datos) => this.predios.set(datos),
      error: () => this.mensajeError.set('No se pudo conectar con el servidor para cargar los predios')
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
      ? this.predioService.crear(datos)
      : this.predioService.actualizar(id, datos);

    peticion.subscribe({
      next: () => {
        this.cancelar();
        this.cargarPredios();
        this.mensajeExito.set(id === null ? '¡Predio registrado con éxito!' : '¡Predio actualizado con éxito!');
        setTimeout(() => this.mensajeExito.set(''), 3500);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.mensaje ?? 'Error al comunicarse con el servidor');
      }
    });
  }

  editar(predio: Predio) {
    this.editandoId.set(predio.id);
    this.mensajeError.set('');
    this.mensajeExito.set('');

    this.formulario.setValue({
      direccion: predio.direccion,
      barrio: predio.barrio,
      matricula_inmobiliaria: predio.matricula_inmobiliaria,
      estrato: Number(predio.estrato) || 1,
      tipo_predio: predio.tipo_predio,
      propietario: predio.propietario,
      estado: predio.estado
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelar() {
    this.editandoId.set(null);
    this.mensajeError.set('');
    this.formulario.reset({
      direccion: '',
      barrio: '',
      matricula_inmobiliaria: '',
      estrato: 1,
      tipo_predio: 'residencial',
      propietario: '',
      estado: 'activo'
    });
  }

  cambiarEstado(predio: Predio, nuevoEstado: string) {
    this.predioService.cambiarEstado(predio.id, nuevoEstado).subscribe({
      next: () => {
        this.cargarPredios();
        this.mensajeExito.set(`Estado actualizado a: ${nuevoEstado === 'activo' ? 'Activo' : 'Inactivo'}`);
        setTimeout(() => this.mensajeExito.set(''), 3000);
      },
      error: (err) => {
        this.mensajeError.set(err.error?.mensaje ?? 'Error al actualizar el estado');
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Estás segura de eliminar este predio?')) {
      this.predioService.eliminar(id).subscribe({
        next: () => {
          this.cargarPredios();
          this.mensajeExito.set('Predio eliminado correctamente');
          setTimeout(() => this.mensajeExito.set(''), 3000);
        },
        error: (err) => {
          this.mensajeError.set(err.error?.mensaje ?? 'Error al eliminar el predio');
        }
      });
    }
  }

  cambiarFiltro(nuevoEstado: string) {
    this.filtroEstado.set(nuevoEstado);
  }
}
