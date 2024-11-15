import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RubrosArregloPagoComponent } from './componentes/rubrosArregloPago.component';

const routes: Routes = [
  { path: '', component: RubrosArregloPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RubrosArregloPagoRoutingModule {}
