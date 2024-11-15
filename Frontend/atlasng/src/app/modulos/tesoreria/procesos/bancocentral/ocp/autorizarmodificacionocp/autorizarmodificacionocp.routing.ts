import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizarModificacionOcpComponent } from './componentes/autorizarmodificacionocp.component';

const routes: Routes = [
  { path: '', component: AutorizarModificacionOcpComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorizarModificacionOcpRoutingModule {}
