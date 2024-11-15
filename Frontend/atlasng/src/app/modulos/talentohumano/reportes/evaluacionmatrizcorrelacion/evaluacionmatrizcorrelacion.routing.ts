import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionMatrizCorrelacionComponent } from './componentes/evaluacionmatrizcorrelacion.component';

const routes: Routes = [
  { path: '', component: EvaluacionMatrizCorrelacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionmatrizcorrelacionRoutingModule {}
