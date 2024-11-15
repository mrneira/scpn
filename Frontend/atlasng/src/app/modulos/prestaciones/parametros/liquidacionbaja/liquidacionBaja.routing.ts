import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidacionBajaComponent } from './componentes/liquidacionBaja.component';

const routes: Routes = [
  { path: '', component: LiquidacionBajaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidacionBajaRoutingModule {}
