import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaCalificacionReporteComponent } from './componentes/consultaCalificacion.component';

const routes: Routes = [
  { path: '', component: ConsultaCalificacionReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaCalificacionReporteRoutingModule {}
