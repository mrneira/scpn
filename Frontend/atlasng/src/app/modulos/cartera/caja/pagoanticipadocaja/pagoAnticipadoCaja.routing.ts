import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoAnticipadoCajaComponent } from './componentes/pagoAnticipadoCaja.component';

const routes: Routes = [
  { path: '', component: PagoAnticipadoCajaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoAnticipadoCajaRoutingModule {}