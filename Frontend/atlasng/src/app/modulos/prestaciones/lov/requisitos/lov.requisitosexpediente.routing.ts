import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovRequisitosExpedienteComponent } from './componentes/lov.requisitosexpediente.component'; 

const routes: Routes = [
  {
    path: '', component: LovRequisitosExpedienteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovRequisitosExpedienteRoutingModule {}
