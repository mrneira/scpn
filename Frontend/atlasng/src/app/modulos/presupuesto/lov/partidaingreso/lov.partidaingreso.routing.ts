import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovPartidaIngresoComponent } from './componentes/lov.partidaingreso.component';

const routes: Routes = [
  {
    path: '', component: LovPartidaIngresoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovPartidaIngresoRoutingModule {}
