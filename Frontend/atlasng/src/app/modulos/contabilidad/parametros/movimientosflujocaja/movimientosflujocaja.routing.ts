import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovimientosflujocajaComponent } from './componentes/movimientosflujocaja.component';

const routes: Routes = [
  { path: '', component: MovimientosflujocajaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosflujocajaRoutingModule {}
