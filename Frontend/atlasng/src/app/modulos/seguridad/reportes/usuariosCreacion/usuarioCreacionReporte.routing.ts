import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuarioCreacionReporteComponent } from './componentes/usuarioCreacionReporte.component';

const routes: Routes = [
  { path: '', component: UsuarioCreacionReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioCreacionReporteRoutingModule {}
