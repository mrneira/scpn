import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuarioIngresoReporteComponent } from './componentes/usuarioIngresoReporte.component';

const routes: Routes = [
  { path: '', component: UsuarioIngresoReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioIngresoReporteRoutingModule {}
