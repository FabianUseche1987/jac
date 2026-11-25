import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Usuarios } from './usuarios/usuarios';
import { Proyectos } from './proyectos/proyectos';
import { Reuniones } from './reuniones/reuniones';

export const routes: Routes = [
  { path: '', component: Home },                // la página empieza en el inicio
  { path: 'usuarios', component: Usuarios },
  { path: 'proyectos', component: Proyectos },
  { path: 'reuniones', component: Reuniones },
  { path: '**', redirectTo: '' }                // cualquier ruta que no exista vuelve al inicio
];
