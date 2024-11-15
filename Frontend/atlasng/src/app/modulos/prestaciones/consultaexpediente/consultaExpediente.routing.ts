import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaExpedienteComponent } from './componentes/consultaExpediente.component';

const routes: Routes = [
  { path: '', component: ConsultaExpedienteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaExpedienteRoutingModule {}
