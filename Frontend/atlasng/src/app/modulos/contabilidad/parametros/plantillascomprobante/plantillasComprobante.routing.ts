import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantillasComprobanteComponent } from './componentes/plantillasComprobante.component';

const routes: Routes = [
  { path: '', component: PlantillasComprobanteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulosRoutingModule {}
