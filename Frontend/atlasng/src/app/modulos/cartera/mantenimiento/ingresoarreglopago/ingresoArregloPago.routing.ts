import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoArregloPagoComponent } from './componentes/ingresoArregloPago.component';

const routes: Routes = [
  {
    path: '', component: IngresoArregloPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoArregloPagoRoutingModule { }
