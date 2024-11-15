import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalificacionCualitativaComponent } from './componentes/calificacioncualitativa.component';

const routes: Routes = [
  { path: '', component: CalificacionCualitativaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalificacionCualitativaRoutingModule {}
