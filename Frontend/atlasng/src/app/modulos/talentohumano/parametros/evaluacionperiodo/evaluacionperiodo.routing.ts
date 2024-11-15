import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionperiodoComponent } from './componentes/evaluacionperiodo.component';

const routes: Routes = [
  { path: '', component: EvaluacionperiodoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionperiodoRoutingModule {}
