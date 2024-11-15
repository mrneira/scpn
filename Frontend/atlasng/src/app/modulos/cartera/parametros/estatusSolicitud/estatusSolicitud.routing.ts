import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstatusSolicitudComponent } from './componentes/estatusSolicitud.component';

const routes: Routes = [
  { path: '', component: EstatusSolicitudComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstatusSolicitudRoutingModule {}
