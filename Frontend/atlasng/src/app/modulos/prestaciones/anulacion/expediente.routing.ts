import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpedienteComponent } from './componentes/expediente.component';

const routes: Routes = [
  { path: '', component: ExpedienteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpedienteRoutingModule {}
