import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Usuarios } from './usuarios/usuarios';
import { Proyectos } from './proyectos/proyectos';
import { Reuniones } from './reuniones/reuniones';
import { Predios } from './predios/predios';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'usuarios', component: Usuarios },
  { path: 'proyectos', component: Proyectos },
  { path: 'reuniones', component: Reuniones },
  { path: 'predios', component: Predios },
  { path: '**', redirectTo: '' }
];
