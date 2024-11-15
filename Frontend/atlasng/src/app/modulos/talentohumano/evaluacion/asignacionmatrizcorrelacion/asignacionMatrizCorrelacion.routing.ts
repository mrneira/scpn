import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignacionMatrizCorrelacionComponent } from './componentes/asignacionMatrizCorrelacion.component';

const routes: Routes = [
  { path: '', component: AsignacionMatrizCorrelacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionMatrizCorrelacionRoutingModule {}
