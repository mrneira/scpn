import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaldoVacacionesComponent } from './componentes/saldoVacaciones.component';

const routes: Routes = [
  { path: '', component: SaldoVacacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaldoVacacionesRoutingModule {}
