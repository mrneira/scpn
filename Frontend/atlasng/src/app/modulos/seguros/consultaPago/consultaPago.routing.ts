import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaPagoComponent } from './componentes/consultaPago.component';

const routes: Routes = [
  {
    path: '', component: ConsultaPagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaPagoRoutingModule { }
