import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionMetasUnidadComponent } from './componentes/evaluacionmetasunidad.component';

const routes: Routes = [
  { path: '', component: EvaluacionMetasUnidadComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionmetasunidadRoutingModule {}
