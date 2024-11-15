import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudCapacidadPagoComponent } from './componentes/solicitudcapacidadpago.component';

const routes: Routes = [
  {
    path: '', component: SolicitudCapacidadPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitudCapacidadPagoRoutingModule { }
