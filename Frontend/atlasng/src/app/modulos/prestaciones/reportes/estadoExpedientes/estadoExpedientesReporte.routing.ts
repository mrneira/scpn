import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoExpedientesReporteComponent } from './componentes/estadoExpedientesReporte.component';

const routes: Routes = [
  { path: '', component: EstadoExpedientesReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoExpedientesReporteRoutingModule {}
