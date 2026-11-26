// =============================================================
// usuarios.spec.ts - Pruebas unitarias del componente Usuarios
// El UsuarioService se reemplaza por un "spy" de Jasmine, así las
// pruebas no necesitan el backend ni la base de datos.
// Ejecutar con: npm test
// =============================================================
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Usuarios } from './usuarios';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../models/usuario';

describe('Usuarios', () => {
  let fixture: ComponentFixture<Usuarios>;
  let componente: Usuarios;
  let servicio: jasmine.SpyObj<UsuarioService>;

  // Usuarios de ejemplo que "devuelve" el servicio falso
  const usuariosPrueba: Usuario[] = [
    { id: 1, nombres: 'Ana María', apellidos: 'Gómez', tipo_documento: 'CC', numero_documento: '1012345678',
      correo: 'ana@correo.com', celular: '3001234567', rol: 'administrador', estado: 'activo' },
    { id: 2, nombres: 'Carlos', apellidos: 'Pérez', tipo_documento: 'CE', numero_documento: '556677',
      correo: 'carlos@correo.com', celular: null, rol: 'ciudadano', estado: 'inactivo' }
  ];

  // Llena el formulario con datos válidos
  function llenarFormularioValido() {
    componente.formulario.setValue({
      nombres: 'Luz', apellidos: 'Chaparro', tipo_documento: 'CC', numero_documento: '52123456',
      correo: 'luz@correo.com', celular: '3109876543', rol: 'miembro'
    });
  }

  beforeEach(async () => {
    servicio = jasmine.createSpyObj<UsuarioService>('UsuarioService',
      ['listar', 'crear', 'actualizar', 'cambiarEstado']);
    servicio.listar.and.returnValue(of(usuariosPrueba));

    await TestBed.configureTestingModule({
      imports: [Usuarios],
      providers: [{ provide: UsuarioService, useValue: servicio }]
    }).compileComponents();

    fixture = TestBed.createComponent(Usuarios);
    componente = fixture.componentInstance;
    fixture.detectChanges(); // dibuja la plantilla
  });

  it('se crea y carga los usuarios al iniciar', () => {
    expect(componente).toBeTruthy();
    expect(servicio.listar).toHaveBeenCalled();
    expect(componente.usuarios().length).toBe(2);
  });

  it('muestra los usuarios en la tabla', () => {
    const tabla: HTMLElement = fixture.nativeElement.querySelector('tbody');
    expect(tabla.textContent).toContain('Ana María');
    expect(tabla.textContent).toContain('Carlos');
  });

  it('el formulario vacío es inválido y no se envía al servidor', () => {
    componente.formulario.patchValue({ nombres: '', apellidos: '', numero_documento: '', correo: '' });
    componente.guardar();
    expect(componente.formulario.invalid).toBeTrue();
    expect(servicio.crear).not.toHaveBeenCalled();
  });

  it('rechaza un correo sin formato válido', () => {
    llenarFormularioValido();
    componente.formulario.controls.correo.setValue('luz-correo');
    expect(componente.formulario.controls.correo.hasError('email')).toBeTrue();
  });

  it('el celular debe tener 10 dígitos', () => {
    componente.formulario.controls.celular.setValue('300123');
    expect(componente.formulario.controls.celular.valid).toBeFalse();
    componente.formulario.controls.celular.setValue('3001234567');
    expect(componente.formulario.controls.celular.valid).toBeTrue();
  });

  it('con datos válidos crea el usuario y limpia el formulario', () => {
    servicio.crear.and.returnValue(of(usuariosPrueba[0]));
    llenarFormularioValido();
    componente.guardar();
    expect(servicio.crear).toHaveBeenCalledWith(jasmine.objectContaining({ nombres: 'Luz', rol: 'miembro' }));
    expect(componente.formulario.controls.nombres.value).toBe('');
  });

  it('muestra el mensaje del backend si el documento ya existe', () => {
    servicio.crear.and.returnValue(throwError(() => ({
      error: { mensaje: 'Ya existe un usuario con ese número de documento o correo' }
    })));
    llenarFormularioValido();
    componente.guardar();
    expect(componente.mensajeError()).toContain('Ya existe un usuario');
  });

  it('editar copia los datos del usuario al formulario', () => {
    componente.editar(usuariosPrueba[1]);
    expect(componente.editandoId()).toBe(2);
    expect(componente.formulario.controls.nombres.value).toBe('Carlos');
    expect(componente.formulario.controls.celular.value).toBe(''); // celular null se muestra vacío
  });
});
