import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuposLiquidacionComponent } from './componentes/cuposliquidacion.component';

const routes: Routes = [
  { path: '', component: CuposLiquidacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuposLiquidacionRoutingModule {}
