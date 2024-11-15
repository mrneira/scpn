import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CondicionesArregloPagoComponent } from './componentes/_condicionesArregloPago.component';

const routes: Routes = [
  {
    path: '', component: CondicionesArregloPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondicionesArregloPagoRoutingModule { }
