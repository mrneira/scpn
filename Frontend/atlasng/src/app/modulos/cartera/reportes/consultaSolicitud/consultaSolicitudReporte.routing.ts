import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaSolicitudReporteComponent } from './componentes/consultaSolicitudReporte.component';

const routes: Routes = [
  { path: '', component: ConsultaSolicitudReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaSolicitudReporteRoutingModule {}
