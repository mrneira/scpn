import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaldosMensualesComponent } from './componentes/saldosmensuales.component';

const routes: Routes = [
  { path: '', component: SaldosMensualesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaldosMensualesRoutingModule {}
