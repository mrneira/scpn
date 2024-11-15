import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalificacionArregloPagoComponent } from './componentes/calificacionArregloPago.component';

const routes: Routes = [
  { path: '', component: CalificacionArregloPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalificacionArregloPagoRoutingModule {}
