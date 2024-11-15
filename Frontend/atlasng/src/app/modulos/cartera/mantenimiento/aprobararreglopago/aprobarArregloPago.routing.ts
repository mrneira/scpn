import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AprobarArregloPagoComponent } from './componentes/aprobarArregloPago.component';

const routes: Routes = [
  { path: '', component: AprobarArregloPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobarArregloPagoRoutingModule {}
