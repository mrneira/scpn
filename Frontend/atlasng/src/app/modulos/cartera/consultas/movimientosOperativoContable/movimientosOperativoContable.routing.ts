import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovimientosOperativoContableComponent } from './componentes/movimientosOperativoContable.component';

const routes: Routes = [
  {
    path: '', component: MovimientosOperativoContableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovimientosOperativoContableRoutingModule { }
