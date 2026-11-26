// =============================================================
// app.spec.ts - Pruebas del componente principal (menú de navegación)
// Ejecutar con: npm test
// =============================================================
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])] // el menú usa routerLink, por eso necesita el router
    }).compileComponents();
  });

  it('se crea la aplicación', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra el nombre JAC Connect en el menú', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const menu: HTMLElement = fixture.nativeElement.querySelector('.navbar-brand');
    expect(menu.textContent).toContain('JAC Connect');
  });

  it('el menú tiene un enlace a cada módulo', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const enlaces = Array.from(fixture.nativeElement.querySelectorAll('.nav-link') as NodeListOf<HTMLElement>)
      .map(enlace => enlace.textContent?.trim());
    expect(enlaces).toEqual(['Usuarios', 'Proyectos', 'Reuniones', 'Predios']);
  });
});
