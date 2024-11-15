import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AprobacionEvaluacionComponent  } from './componentes/evaluacionaprob.component';

const routes: Routes = [
  { path: '', component: AprobacionEvaluacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobacionEvaluacionRoutingModule {}
