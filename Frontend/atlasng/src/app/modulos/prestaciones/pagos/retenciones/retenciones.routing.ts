import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoRetencionesComponent } from './componentes/retenciones.component';

const routes: Routes = [
  { path: '', component: PagoRetencionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagosRetencionesRoutingModule {}
