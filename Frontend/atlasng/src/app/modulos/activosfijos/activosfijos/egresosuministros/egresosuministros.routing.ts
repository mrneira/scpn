import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EgresoSuministrosComponent } from './componentes/egresosuministros.component';

const routes: Routes = [
  { path: '', component: EgresoSuministrosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EgresoSuministrosRoutingModule {}
