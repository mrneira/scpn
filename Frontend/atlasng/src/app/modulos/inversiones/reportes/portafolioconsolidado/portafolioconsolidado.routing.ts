import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortafolioconsolidadoComponent } from './componentes/portafolioconsolidado.component';

const routes: Routes = [
  { path: '', component: PortafolioconsolidadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortafolioconsolidadoRoutingModule {}
