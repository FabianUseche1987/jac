// =============================================================
// proyectos.spec.ts - Pruebas unitarias del componente Proyectos
// El ProyectoService se reemplaza por un "spy" de Jasmine, así las
// pruebas no necesitan el backend ni la base de datos.
// Ejecutar con: npm test
// =============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Proyectos } from './proyectos';
import { ProyectoService } from '../services/proyecto.service';
import { Proyecto } from '../models/proyecto';

describe('Proyectos', () => {
  let fixture: ComponentFixture<Proyectos>;
  let componente: Proyectos;
  let servicio: jasmine.SpyObj<ProyectoService>;

  // Proyectos de ejemplo que "devuelve" el servicio falso
  const proyectosPrueba: Proyecto[] = [
    { id: 1, titulo: 'Parque infantil', descripcion: 'Cambio de columpios', presupuesto: 0,
      fecha_inicio: '2026-12-01', fecha_fin: null, estado: 'propuesto' },
    { id: 2, titulo: 'Alumbrado de la cancha', descripcion: 'Instalación de lámparas', presupuesto: 0,
      fecha_inicio: '2026-10-01', fecha_fin: '2026-11-30', estado: 'en ejecucion' },
    { id: 3, titulo: 'Pintura del salón comunal', descripcion: 'Pintura de fachada', presupuesto: 0,
      fecha_inicio: '2026-08-01', fecha_fin: '2026-08-15', estado: 'finalizado' }
  ];

  // Llena el formulario con datos válidos
  function llenarFormularioValido() {
    componente.formulario.setValue({
      titulo: 'Huerta comunitaria', descripcion: 'Siembra de hortalizas en el lote comunal',
      presupuesto: 0, fecha_inicio: '2027-01-10', fecha_fin: '2027-03-10', estado: 'propuesto'
    });
  }

  beforeEach(async () => {
    servicio = jasmine.createSpyObj<ProyectoService>('ProyectoService',
      ['listar', 'crear', 'actualizar', 'cambiarEstado', 'eliminar']);
    servicio.listar.and.returnValue(of(proyectosPrueba));

    await TestBed.configureTestingModule({
      imports: [Proyectos],
      providers: [{ provide: ProyectoService, useValue: servicio }]
    }).compileComponents();

    fixture = TestBed.createComponent(Proyectos);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea y carga los proyectos al iniciar', () => {
    expect(componente).toBeTruthy();
    expect(servicio.listar).toHaveBeenCalled();
    expect(componente.proyectos().length).toBe(3);
  });

  it('cuenta los proyectos en ejecución y finalizados', () => {
    expect(componente.proyectosEnEjecucion()).toBe(1);
    expect(componente.proyectosFinalizados()).toBe(1);
  });

  it('el filtro por estado muestra solo los proyectos de ese estado', () => {
    componente.cambiarFiltro('finalizado');
    expect(componente.proyectosFiltrados().length).toBe(1);
    expect(componente.proyectosFiltrados()[0].titulo).toBe('Pintura del salón comunal');
  });

  it('un título de menos de 3 letras hace inválido el formulario', () => {
    llenarFormularioValido();
    componente.formulario.controls.titulo.setValue('Ok');
    componente.guardar();
    expect(servicio.crear).not.toHaveBeenCalled();
  });

  it('no envía el proyecto si la fecha de fin es anterior a la de inicio', () => {
    llenarFormularioValido();
    componente.formulario.patchValue({ fecha_inicio: '2027-03-10', fecha_fin: '2027-01-10' });
    componente.guardar();
    expect(servicio.crear).not.toHaveBeenCalled();
    expect(componente.mensajeError()).toContain('fecha de finalización');
  });

  it('con datos válidos crea el proyecto y muestra mensaje de éxito', () => {
    servicio.crear.and.returnValue(of(proyectosPrueba[0]));
    llenarFormularioValido();
    componente.guardar();
    expect(servicio.crear).toHaveBeenCalled();
    expect(componente.mensajeExito()).toContain('registrado');
  });

  it('muestra un aviso si no hay conexión con el servidor', () => {
    servicio.listar.and.returnValue(throwError(() => new Error('sin conexión')));
    componente.cargarProyectos();
    expect(componente.mensajeError()).toContain('No se pudo conectar');
  });

  it('eliminar no hace nada si el usuario cancela la confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    componente.eliminar(1);
    expect(servicio.eliminar).not.toHaveBeenCalled();
  });
});
