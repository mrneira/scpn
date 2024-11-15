import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoDirectoComponent } from './componentes/pagoDirecto.component';

const routes: Routes = [
  {
    path: '', component: PagoDirectoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoDirectoRoutingModule { }
