import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PorcentajesRetencionAirComponent } from './componentes/porcentajesRetencionAir.component';

const routes: Routes = [
  { path: '', component: PorcentajesRetencionAirComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulosRoutingModule {}
