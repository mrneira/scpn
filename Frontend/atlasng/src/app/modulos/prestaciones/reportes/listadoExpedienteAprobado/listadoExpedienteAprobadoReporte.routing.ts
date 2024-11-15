import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoExpedienteAprobadoReporteComponent } from './componentes/listadoExpedienteAprobadoReporte.component';

const routes: Routes = [
  { path: '', component: ListadoExpedienteAprobadoReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListadoExpedienteAprobadoReporteRoutingModule {}
