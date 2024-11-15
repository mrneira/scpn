import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultasolicitudComponent } from './componentes/consultasolicitud.component';

const routes: Routes = [
  {
    path: '', component: ConsultasolicitudComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasolicitudRoutingModule { }
