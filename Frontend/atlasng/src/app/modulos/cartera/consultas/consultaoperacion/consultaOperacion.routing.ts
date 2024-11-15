import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaOperacionComponent } from './componentes/consultaOperacion.component';

const routes: Routes = [
  {
    path: '', component: ConsultaOperacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaOperacionRoutingModule { }
