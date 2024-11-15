import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GarantiasParqueaderoComponent } from './componentes/garantiasparqueadero.component';

const routes: Routes = [
  { path: '', component: GarantiasParqueaderoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GarantiasParqueaderoRoutingModule {}
