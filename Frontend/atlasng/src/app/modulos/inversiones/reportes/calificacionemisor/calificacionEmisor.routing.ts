import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalificacionEmisorComponent } from './componentes/calificacionEmisor.component';

const routes: Routes = [
  { path: '', component: CalificacionEmisorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalificacionEmisorRoutingModule {}
