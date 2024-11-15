import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovOperacionArregloPagoComponent } from './componentes/lov.operacionArregloPago.component';

const routes: Routes = [
  {
    path: '', component: LovOperacionArregloPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovOperacionArregloPagoRoutingModule {}
