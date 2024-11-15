import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadoFlujoEfectivoComponent } from './componentes/estadoFlujoEfectivo.component';

const routes: Routes = [
  { path: '', component: EstadoFlujoEfectivoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadoFlujoEfectivoRoutingModule {}
