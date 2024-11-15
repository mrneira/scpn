import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionPatrimonioComponent } from './componentes/evaluacionpatrimonio.component';

const routes: Routes = [
  { path: '', component: EvaluacionPatrimonioComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionPatrimonioRoutingModule {}
