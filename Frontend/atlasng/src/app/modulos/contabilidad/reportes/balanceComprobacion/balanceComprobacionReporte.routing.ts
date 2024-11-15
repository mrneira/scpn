import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalanceComprobacionReporteComponent } from './componentes/balanceComprobacionReporte.component';

const routes: Routes = [
  { path: '', component: BalanceComprobacionReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalanceComprobacionReporteRoutingModule {}
