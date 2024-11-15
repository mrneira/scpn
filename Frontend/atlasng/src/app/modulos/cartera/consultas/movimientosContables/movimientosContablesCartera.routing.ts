import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovimientosContablesCarteraComponent } from './componentes/movimientosContablesCartera.component';

const routes: Routes = [
  {
    path: '', component: MovimientosContablesCarteraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosContablesCarteraRoutingModule { }
