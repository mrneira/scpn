import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargarPartidaIngresoComponent } from './componentes/cargarpartidaingreso.component';

const routes: Routes = [
  { path: '', component: CargarPartidaIngresoComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargarPartidaIngresoRoutingModule {}
