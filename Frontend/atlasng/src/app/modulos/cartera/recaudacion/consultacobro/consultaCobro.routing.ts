import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaCobroComponent } from './componentes/consultaCobro.component';

const routes: Routes = [
  {
    path: '', component: ConsultaCobroComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaCobroRoutingModule { }
