import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoNovedadPagoComponent } from './componentes/tipoNovedadPago.component';

const routes: Routes = [
  { path: '', component: TipoNovedadPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoNovedadPagoRoutingModule {}
