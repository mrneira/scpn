import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EliminarPagoSpiComponent } from './componentes/eliminarpagospi.component';

const routes: Routes = [
  { path: '', component: EliminarPagoSpiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EliminarPagoSpiRoutingModule {}
