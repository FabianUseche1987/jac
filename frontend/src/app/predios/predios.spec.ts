// =============================================================
// predios.spec.ts - Pruebas unitarias del componente Predios
// El PredioService se reemplaza por un "spy" de Jasmine, así las
// pruebas no necesitan el backend ni la base de datos.
// Ejecutar con: npm test
// =============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Predios } from './predios';
import { PredioService } from '../services/predio.service';
import { Predio } from '../models/predio';

describe('Predios', () => {
  let fixture: ComponentFixture<Predios>;
  let componente: Predios;
  let servicio: jasmine.SpyObj<PredioService>;

  // Predios de ejemplo que "devuelve" el servicio falso
  const prediosPrueba: Predio[] = [
    { id: 1, direccion: 'Calle 10 # 15-20', barrio: 'Centro', matricula_inmobiliaria: '050-123456',
      estrato: 3, tipo_predio: 'comunitario', propietario: 'JAC Centro', estado: 'activo' },
    { id: 2, direccion: 'Carrera 5 # 8-12', barrio: 'La Esperanza', matricula_inmobiliaria: '050-654321',
      estrato: 2, tipo_predio: 'lote', propietario: 'Municipio', estado: 'inactivo' }
  ];

  // Llena el formulario con datos válidos
  function llenarFormularioValido() {
    componente.formulario.setValue({
      direccion: 'Calle 20 # 3-40', barrio: 'San José', matricula_inmobiliaria: '050-777888',
      estrato: 2, tipo_predio: 'comunitario', propietario: 'JAC San José', estado: 'activo'
    });
  }

  beforeEach(async () => {
    servicio = jasmine.createSpyObj<PredioService>('PredioService',
      ['listar', 'crear', 'actualizar', 'cambiarEstado', 'eliminar']);
    servicio.listar.and.returnValue(of(prediosPrueba));

    await TestBed.configureTestingModule({
      imports: [Predios],
      providers: [{ provide: PredioService, useValue: servicio }]
    }).compileComponents();

    fixture = TestBed.createComponent(Predios);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea y carga los predios al iniciar', () => {
    expect(componente).toBeTruthy();
    expect(servicio.listar).toHaveBeenCalled();
    expect(componente.totalPredios()).toBe(2);
  });

  it('cuenta los predios activos e inactivos', () => {
    expect(componente.prediosActivos()).toBe(1);
    expect(componente.prediosInactivos()).toBe(1);
  });

  it('muestra la matrícula de los predios en la tabla', () => {
    const tabla: HTMLElement = fixture.nativeElement.querySelector('tbody');
    expect(tabla.textContent).toContain('050-123456');
  });

  it('el estrato debe estar entre 1 y 6', () => {
    componente.formulario.controls.estrato.setValue(7);
    expect(componente.formulario.controls.estrato.hasError('max')).toBeTrue();
    componente.formulario.controls.estrato.setValue(0);
    expect(componente.formulario.controls.estrato.hasError('min')).toBeTrue();
  });

  it('no envía el predio si falta la matrícula inmobiliaria', () => {
    llenarFormularioValido();
    componente.formulario.controls.matricula_inmobiliaria.setValue('');
    componente.guardar();
    expect(servicio.crear).not.toHaveBeenCalled();
  });

  it('con datos válidos crea el predio', () => {
    servicio.crear.and.returnValue(of(prediosPrueba[0]));
    llenarFormularioValido();
    componente.guardar();
    expect(servicio.crear).toHaveBeenCalledWith(jasmine.objectContaining({ matricula_inmobiliaria: '050-777888' }));
    expect(componente.mensajeExito()).toContain('registrado');
  });

  it('muestra el mensaje del backend si la matrícula ya existe', () => {
    servicio.crear.and.returnValue(throwError(() => ({
      error: { mensaje: 'Ya existe un predio con esa matrícula inmobiliaria' }
    })));
    llenarFormularioValido();
    componente.guardar();
    expect(componente.mensajeError()).toContain('Ya existe un predio');
  });

  it('cambiarEstado llama al servicio con el nuevo estado', () => {
    servicio.cambiarEstado.and.returnValue(of(prediosPrueba[0]));
    componente.cambiarEstado(prediosPrueba[0], 'inactivo');
    expect(servicio.cambiarEstado).toHaveBeenCalledWith(1, 'inactivo');
  });
});
