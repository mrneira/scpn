import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpedienteAsignacionComponent } from './componentes/expedienteasignacion.component';

const routes: Routes = [
  { path: '', component: ExpedienteAsignacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpedienteAsignacionRoutingModule {}
