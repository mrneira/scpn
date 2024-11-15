import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaSeguroComponent } from './componentes/consultaSeguro.component';

const routes: Routes = [
  {
    path: '', component: ConsultaSeguroComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaSeguroRoutingModule { }
