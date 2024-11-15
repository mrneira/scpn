import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartidaIngresoComponent } from './componentes/partidaIngreso.component';

const routes: Routes = [
  { path: '', component: PartidaIngresoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartidaIngresoRoutingModule {}
