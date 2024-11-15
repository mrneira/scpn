import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarPagoSpiComponent } from './componentes/agregarpagospi.component';

const routes: Routes = [
  { path: '', component: AgregarPagoSpiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgregarPagoSpiRoutingModule {}
