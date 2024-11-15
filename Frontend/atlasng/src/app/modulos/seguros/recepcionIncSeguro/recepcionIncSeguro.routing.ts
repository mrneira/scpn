import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecepcionIncSeguroComponent } from './componentes/recepcionIncSeguro.component';

const routes: Routes = [
  {
    path: '', component: RecepcionIncSeguroComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecepcionIncSeguroRoutingModule { }
