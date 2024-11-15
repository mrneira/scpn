import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoSuministrosComponent } from './componentes/ingresosuministros.component';

const routes: Routes = [
  { path: '', component: IngresoSuministrosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoSuministrosRoutingModule {}
