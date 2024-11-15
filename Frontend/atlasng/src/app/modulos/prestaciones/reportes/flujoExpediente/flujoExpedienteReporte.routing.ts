import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlujoExpedienteReporteComponent } from './componentes/flujoExpedienteReporte.component';

const routes: Routes = [
  { path: '', component: FlujoExpedienteReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoExpedienteReporteRoutingModule {}
