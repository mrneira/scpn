import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalificacionActivosComponent } from './componentes/calificacionActivos.component';

const routes: Routes = [
  { path: '', component: CalificacionActivosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalificacionActivosRoutingModule {}
