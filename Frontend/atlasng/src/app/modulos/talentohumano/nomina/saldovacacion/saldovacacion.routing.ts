import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaldoVacacion } from './componentes/saldovacacion.component';

const routes: Routes = [
  { path: '', component: SaldoVacacion,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaldoVacacionRoutingModule {}
