import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PeriodoContableComponent } from './componentes/periodocontable.component';

const routes: Routes = [
  { path: '', component: PeriodoContableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeriodoContableRoutingModule {}
