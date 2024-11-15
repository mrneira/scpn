import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoArregloPagoComponent } from './componentes/tipoArregloPago.component';

const routes: Routes = [
  { path: '', component: TipoArregloPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoArregloPagoRoutingModule {}
