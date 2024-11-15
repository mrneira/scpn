import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoricoportafoliorfComponent } from './componentes/historicoportafoliorf.component';

const routes: Routes = [
  { path: '', component:HistoricoportafoliorfComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricoportafoliorfRoutingModule {}
