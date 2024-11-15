import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BalanceCarteraComponent } from './componentes/balanceCartera.component';

const routes: Routes = [
  {
    path: '', component: BalanceCarteraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalanceCarteraRoutingModule { }
