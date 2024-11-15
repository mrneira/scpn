import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionAsignacionnjsComponent } from './componentes/evaluacionAsignacionnjs.component';

const routes: Routes = [
  { path: '', component: EvaluacionAsignacionnjsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionAsignacionnjsRoutingModule {}
