import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AprobarPagoSpiComponent } from './componentes/aprobarpagospi.component';

const routes: Routes = [
  { path: '', component: AprobarPagoSpiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobarPagoSpiRoutingModule {}
