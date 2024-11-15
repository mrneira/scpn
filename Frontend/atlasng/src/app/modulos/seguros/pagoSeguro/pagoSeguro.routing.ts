import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoSeguroComponent } from './componentes/pagoSeguro.component';

const routes: Routes = [
  {
    path: '', component: PagoSeguroComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoSeguroRoutingModule { }
