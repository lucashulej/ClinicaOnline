import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { ProfesionalComponent } from './componentes/profesional/profesional.component';
import { PacienteComponent } from './componentes/paciente/paciente.component';
import { AdministradorComponent } from './componentes/administrador/administrador.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';


const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path:'login', component: LoginComponent, data: {animation:'Login'}},
  {path:'registro', component: RegistroComponent, data: {animation:'Register'}},
  {path:'profesional', component: ProfesionalComponent, canActivate:[AuthGuard]},
  {path:'paciente', component: PacienteComponent, canActivate:[AuthGuard]},
  {path:'administrador', component: AdministradorComponent, canActivate:[AuthGuard]},
  {path:'perfil', component: PerfilComponent, canActivate:[AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
