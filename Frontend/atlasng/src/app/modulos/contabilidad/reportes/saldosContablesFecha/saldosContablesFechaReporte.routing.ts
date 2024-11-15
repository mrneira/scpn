import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaldosContablesFechaReporteComponent } from './componentes/saldosContablesFechaReporte.component';

const routes: Routes = [
  { path: '', component: SaldosContablesFechaReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaldosContablesFechaReporteRoutingModule {}
