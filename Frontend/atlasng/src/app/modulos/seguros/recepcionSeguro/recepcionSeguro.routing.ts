import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecepcionSeguroComponent } from './componentes/recepcionSeguro.component';

const routes: Routes = [
  {
    path: '', component: RecepcionSeguroComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecepcionSeguroRoutingModule { }
