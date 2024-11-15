import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuarioHorarioReporteComponent } from './componentes/usuarioHorarioReporte.component';

const routes: Routes = [
  { path: '', component: UsuarioHorarioReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioHorarioReporteRoutingModule {}
