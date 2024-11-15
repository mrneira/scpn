import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosAccesoReporteComponent } from './componentes/usuariosAccesoReporte.component';

const routes: Routes = [
  { path: '', component: UsuariosAccesoReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosAccesoReporteRoutingModule {}
