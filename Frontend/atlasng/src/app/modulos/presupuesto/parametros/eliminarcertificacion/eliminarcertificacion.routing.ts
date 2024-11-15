import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {EliminarCertificacionComponent} from './componentes/eliminarcertificacion.component';

const routes: Routes = [
  { path: '', component: EliminarCertificacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EliminarCertificacionRoutingModule {}
