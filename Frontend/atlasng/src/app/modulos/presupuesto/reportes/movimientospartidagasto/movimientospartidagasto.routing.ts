import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovimientosPartidaGastoComponent } from './componentes/movimientospartidagasto.component';

const routes: Routes = [
  { path: '', component: MovimientosPartidaGastoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosPartidaGastoRoutingModule {}
