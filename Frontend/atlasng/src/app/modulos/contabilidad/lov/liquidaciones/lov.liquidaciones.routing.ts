import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovLiquidacionesComponent } from './componentes/lov.liquidaciones.component';

const routes: Routes = [
  {
    path: '', component: LovLiquidacionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovLiquidacionesRoutingModule {}
