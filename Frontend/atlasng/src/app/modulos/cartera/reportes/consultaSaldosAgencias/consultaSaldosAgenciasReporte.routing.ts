import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaSaldosAgenciasReporteComponent } from './componentes/consultaSaldosAgenciasReporte.component';

const routes: Routes = [
  { path: '', component: ConsultaSaldosAgenciasReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaSaldosAgenciasReporteRoutingModule {}
