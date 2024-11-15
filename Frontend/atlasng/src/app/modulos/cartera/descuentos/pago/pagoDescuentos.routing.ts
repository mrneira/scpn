import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoDescuentosComponent } from './componentes/pagoDescuentos.component';

const routes: Routes = [
  {
    path: '', component: PagoDescuentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoDescuentosRoutingModule { }
