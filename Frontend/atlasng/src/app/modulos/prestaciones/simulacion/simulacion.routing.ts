import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SimulacionComponent } from './componentes/simulacion.component';

const routes: Routes = [
  { path: '', component: SimulacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulacionRoutingModule {}
