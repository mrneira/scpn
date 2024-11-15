import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargarPartidaGastoComponent } from './componentes/cargarpartidagasto.component';

const routes: Routes = [
  { path: '', component: CargarPartidaGastoComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargarPartidaGastoRoutingModule {}
