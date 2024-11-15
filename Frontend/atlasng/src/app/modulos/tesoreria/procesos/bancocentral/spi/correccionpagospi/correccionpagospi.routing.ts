import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorreccionPagoSpiComponent } from './componentes/correccionpagospi.component';

const routes: Routes = [
  { path: '', component: CorreccionPagoSpiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorreccionPagoSpiRoutingModule {}
