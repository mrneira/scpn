import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaRespuestaPagoSpiComponent } from './componentes/cargarespuestapagospi.component';

const routes: Routes = [
  { path: '', component: CargaRespuestaPagoSpiComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaRespuestaPagoSpiRoutingModule {}
