import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {EvaluacionRecalificacionComponent  } from './componentes/evaluacionrecalificacion.component';

const routes: Routes = [
  { path: '', component: EvaluacionRecalificacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionRecalificacionRoutingModule {}
