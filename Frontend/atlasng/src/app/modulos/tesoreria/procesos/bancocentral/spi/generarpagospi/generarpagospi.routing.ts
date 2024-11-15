import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarPagoSpiComponent } from './componentes/generarpagospi.component';

const routes: Routes = [
  { path: '', component: GenerarPagoSpiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarPagoSpiRoutingModule {}
