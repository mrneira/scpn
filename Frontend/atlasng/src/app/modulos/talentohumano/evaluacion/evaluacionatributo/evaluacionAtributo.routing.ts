import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionAtributoComponent } from './componentes/evaluacionAtributo.component';

const routes: Routes = [
  { path: '', component: EvaluacionAtributoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionAtributoRoutingModule {}
