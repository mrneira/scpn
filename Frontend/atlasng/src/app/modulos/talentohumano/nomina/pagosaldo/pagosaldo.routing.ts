import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoSaldoComponent } from './componentes/pagosaldo.component';

const routes: Routes = [
  { path: '', component: PagoSaldoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoSaldoRoutingModule {}
