import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalanceGeneralReporteComponent } from './componentes/balanceGeneralReporte.component';

const routes: Routes = [
  { path: '', component: BalanceGeneralReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalanceGeneralReporteRoutingModule {}
