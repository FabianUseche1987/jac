// =============================================================
// reuniones.spec.ts - Pruebas unitarias del componente Reuniones
// El ReunionService se reemplaza por un "spy" de Jasmine, así las
// pruebas no necesitan el backend ni la base de datos.
// Ejecutar con: npm test
// =============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Reuniones } from './reuniones';
import { ReunionService } from '../services/reunion.service';
import { Reunion } from '../models/reunion';

describe('Reuniones', () => {
  let fixture: ComponentFixture<Reuniones>;
  let componente: Reuniones;
  let servicio: jasmine.SpyObj<ReunionService>;

  // Reuniones de ejemplo que "devuelve" el servicio falso
  const reunionesPrueba: Reunion[] = [
    { id: 1, titulo: 'Asamblea ordinaria mensual', descripcion: 'Plan del mes', tipo: 'ordinaria',
      fecha: '2026-12-01', hora: '18:30:00', lugar: 'Salón comunal', estado: 'programada', junta_id: 1 },
    { id: 2, titulo: 'Comité de convivencia', descripcion: 'Seguridad del barrio', tipo: 'comite',
      fecha: '2026-11-20', hora: '17:00:00', lugar: 'Parque principal', estado: 'realizada', junta_id: 1 },
    { id: 3, titulo: 'Encuentro comunitario', descripcion: '', tipo: 'comunitaria',
      fecha: '2026-11-25', hora: '18:00:00', lugar: 'Salón comunal', estado: 'cancelada', junta_id: 1 }
  ];

  // Llena el formulario con datos válidos
  function llenarFormularioValido() {
    componente.formulario.setValue({
      titulo: 'Asamblea de vecinos', descripcion: 'Elección de comité', tipo: 'asamblea',
      fecha: '2026-12-15', hora: '19:00', lugar: 'Casa de la cultura', estado: 'programada', junta_id: 1
    });
  }

  beforeEach(async () => {
    servicio = jasmine.createSpyObj<ReunionService>('ReunionService',
      ['listar', 'obtenerPorId', 'crear', 'actualizar', 'cambiarEstado', 'eliminar']);
    servicio.listar.and.returnValue(of(reunionesPrueba));

    await TestBed.configureTestingModule({
      imports: [Reuniones],
      providers: [{ provide: ReunionService, useValue: servicio }]
    }).compileComponents();

    fixture = TestBed.createComponent(Reuniones);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('se crea y carga las reuniones al iniciar', () => {
    expect(componente).toBeTruthy();
    expect(servicio.listar).toHaveBeenCalled();
    expect(componente.reuniones().length).toBe(3);
  });

  it('cuenta las reuniones programadas, realizadas y canceladas', () => {
    expect(componente.reunionesProgramadas()).toBe(1);
    expect(componente.reunionesRealizadas()).toBe(1);
    expect(componente.reunionesCanceladas()).toBe(1);
  });

  it('el filtro por estado muestra solo las reuniones de ese estado', () => {
    componente.cambiarFiltro('programada');
    expect(componente.reunionesFiltradas().length).toBe(1);
    expect(componente.reunionesFiltradas()[0].titulo).toBe('Asamblea ordinaria mensual');
  });

  it('no envía la reunión si falta la fecha, la hora o el lugar', () => {
    llenarFormularioValido();
    componente.formulario.patchValue({ fecha: '', hora: '', lugar: '' });
    componente.guardar();
    expect(servicio.crear).not.toHaveBeenCalled();
  });

  it('con datos válidos crea la reunión y muestra mensaje de éxito', () => {
    servicio.crear.and.returnValue(of(reunionesPrueba[0]));
    llenarFormularioValido();
    componente.guardar();
    expect(servicio.crear).toHaveBeenCalledWith(jasmine.objectContaining({ titulo: 'Asamblea de vecinos' }));
    expect(componente.mensajeExito()).toContain('registrada');
  });

  it('editar recorta la hora a HH:MM para el formulario', () => {
    componente.editar(reunionesPrueba[0]);
    expect(componente.editandoId()).toBe(1);
    expect(componente.formulario.controls.hora.value).toBe('18:30');
  });

  it('muestra el nombre del tipo de reunión con tilde', () => {
    expect(componente.obtenerEtiquetaTipo('comite')).toBe('Comité');
  });

  it('muestra el mensaje del backend si hay un error al guardar', () => {
    servicio.crear.and.returnValue(throwError(() => ({
      error: { mensaje: 'La fecha de la reunión no es válida' }
    })));
    llenarFormularioValido();
    componente.guardar();
    expect(componente.mensajeError()).toBe('La fecha de la reunión no es válida');
  });
});
