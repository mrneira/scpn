import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoExpedienteEstadoReporteComponent } from './componentes/listadoExpedienteEstadoReporte.component';

const routes: Routes = [
  { path: '', component: ListadoExpedienteEstadoReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListadoExpedienteEstadoReporteRoutingModule {}
