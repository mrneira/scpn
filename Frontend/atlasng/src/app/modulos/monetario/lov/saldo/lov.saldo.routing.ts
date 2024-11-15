import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovSaldoComponent } from './componentes/lov.saldo.component';

const routes: Routes = [
  {
    path: '', component: LovSaldoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovSaldoRoutingModule {}
