import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaldoComponent } from './componentes/saldo.component';

const routes: Routes = [
  { path: '', component: SaldoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaldoRoutingModule {}
