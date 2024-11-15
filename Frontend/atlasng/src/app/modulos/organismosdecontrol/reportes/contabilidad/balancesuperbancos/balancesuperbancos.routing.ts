import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalanceSuperBancosComponent } from './componentes/balancesuperbancos.component';

const routes: Routes = [
  { path: '', component: BalanceSuperBancosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalanceSuperBancosRoutingModule {}
