import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperacionPagoComponent } from './componentes/recuperacionpago.component';

const routes: Routes = [
  { path: '', component: RecuperacionPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecuperacionPagoRoutingModule {}
