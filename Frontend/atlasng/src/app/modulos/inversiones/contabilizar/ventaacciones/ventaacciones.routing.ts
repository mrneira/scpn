import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VentaaccionesComponent } from './componentes/ventaacciones.component';

const routes: Routes = [
  { path: '', component: VentaaccionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentaaccionesRoutingModule {}
