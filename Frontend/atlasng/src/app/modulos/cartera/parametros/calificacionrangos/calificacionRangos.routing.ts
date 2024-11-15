import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalificacionRangosComponent } from './componentes/calificacionRangos.component';

const routes: Routes = [
  { path: '', component: CalificacionRangosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalificacionRangosRoutingModule {}
