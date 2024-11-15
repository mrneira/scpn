import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuarioReporteComponent } from './componentes/usuarioReporte.component';

const routes: Routes = [
  { path: '', component: UsuarioReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioReporteRoutingModule {}
