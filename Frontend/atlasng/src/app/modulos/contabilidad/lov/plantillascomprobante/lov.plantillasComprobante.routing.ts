import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovPlantillasComprobanteComponent } from './componentes/lov.plantillasComprobante.component';

const routes: Routes = [
  {
    path: '', component: LovPlantillasComprobanteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovPlantillasComprobanteRoutingModule {}
