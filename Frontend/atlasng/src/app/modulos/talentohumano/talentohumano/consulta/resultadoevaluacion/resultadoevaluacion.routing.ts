import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResultadoEvaluacionComponent } from './componentes/resultadoevaluacion.component';

const routes: Routes = [
  { path: '', component: ResultadoEvaluacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultadoEvaluacionRoutingModule {}
