import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeriodoComponent } from './componentes/periodo.component';

const routes: Routes = [
  { path: '', component: PeriodoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeriodoRoutingModule {}
