import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaDescuentosComponent } from './componentes/consultaDescuentos.component';

const routes: Routes = [
  {
    path: '', component: ConsultaDescuentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaDescuentosRoutingModule { }
