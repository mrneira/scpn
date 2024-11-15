import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoExpedienteAuditoriaReporteComponent } from './componentes/listadoExpedienteAuditoriaReporte.component';

const routes: Routes = [
  { path: '', component: ListadoExpedienteAuditoriaReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListadoExpedienteAuditoriaReporteRoutingModule {}
