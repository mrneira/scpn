import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapacidadPagoComponent } from './componentes/_capacidadPago.component';

const routes: Routes = [
  { path: '', component: CapacidadPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapacidadPagoRoutingModule {}
