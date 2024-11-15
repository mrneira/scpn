import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallePlantillasComprobanteComponent } from './componentes/detallePlantillasComprobante.component';

const routes: Routes = [
  { path: '', component: DetallePlantillasComprobanteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulosRoutingModule {}
