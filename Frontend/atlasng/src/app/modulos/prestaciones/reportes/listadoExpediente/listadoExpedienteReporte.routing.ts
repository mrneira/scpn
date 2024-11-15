import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoExpedienteReporteComponent } from './componentes/listadoExpedienteReporte.component';

const routes: Routes = [
  { path: '', component: ListadoExpedienteReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListadoExpedienteReporteRoutingModule {}
