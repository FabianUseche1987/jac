import { Routes } from '@angular/router';
import { Usuarios } from './usuarios/usuarios';
import { Proyectos } from './proyectos/proyectos';

export const routes: Routes = [
  { path: '', redirectTo: 'proyectos', pathMatch: 'full' },
  { path: 'usuarios', component: Usuarios },
  { path: 'proyectos', component: Proyectos }
];
