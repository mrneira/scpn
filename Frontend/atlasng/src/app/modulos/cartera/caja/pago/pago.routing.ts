import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoComponent } from './componentes/pago.component';

const routes: Routes = [
  { path: '', component: PagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoRoutingModule {}
