import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RenovacionSeguroComponent } from './componentes/renovacionSeguro.component';

const routes: Routes = [
  {
    path: '', component: RenovacionSeguroComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenovacionSeguroRoutingModule { }
