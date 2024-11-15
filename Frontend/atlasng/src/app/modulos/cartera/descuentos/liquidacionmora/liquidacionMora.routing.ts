import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidacionMoraComponent } from './componentes/liquidacionMora.component';

const routes: Routes = [
  { path: '', component: LiquidacionMoraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidacionMoraRoutingModule {}
