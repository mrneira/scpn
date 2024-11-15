import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaRespuestaOcpComponent } from './componentes/cargarespuestaocp.component';

const routes: Routes = [
  { path: '', component: CargaRespuestaOcpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaRespuestaOcpRoutingModule {}
