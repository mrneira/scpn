import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoliciaEstadoReporteComponent } from './componentes/policiaEstadoReporte.component';

const routes: Routes = [
  { path: '', component: PoliciaEstadoReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliciaEstadoReporteRoutingModule {}
