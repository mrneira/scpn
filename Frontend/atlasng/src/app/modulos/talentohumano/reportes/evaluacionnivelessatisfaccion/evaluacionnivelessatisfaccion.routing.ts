import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EvaluacionNivelesSatisfaccionComponent } from './componentes/evaluacionnivelessatisfaccion.component';

const routes: Routes = [
  { path: '', component: EvaluacionNivelesSatisfaccionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluacionnivelessatisfaccionRoutingModule {}
