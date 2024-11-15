import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionasignacionComponent } from './componentes/evaluacionasignacion.component';

const routes: Routes = [
  { path: '', component: EvaluacionasignacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionasignacionRoutingModule {}
