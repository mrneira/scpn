import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialPartidaGastoComponent } from './componentes/historialPartidaGasto.component';

const routes: Routes = [
  { path: '', component: HistorialPartidaGastoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistorialPartidaGastoRoutingModule {}
