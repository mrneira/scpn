import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalanceComparativoReporteComponent } from './componentes/balanceComparativoReporte.component';

const routes: Routes = [
  { path: '', component: BalanceComparativoReporteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalanceComparativoReporteRoutingModule {}
