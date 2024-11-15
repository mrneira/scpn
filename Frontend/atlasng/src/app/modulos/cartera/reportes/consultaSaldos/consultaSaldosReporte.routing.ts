import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaSaldosReporteComponent } from './componentes/consultaSaldosReporte.component';

const routes: Routes = [
  { path: '', component: ConsultaSaldosReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaSaldosReporteRoutingModule {}
