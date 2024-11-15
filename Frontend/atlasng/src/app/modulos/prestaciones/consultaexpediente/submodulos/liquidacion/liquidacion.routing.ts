import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidaciomComponent } from './componentes/liquidacion.component';

const routes: Routes = [
  { path: '', component: LiquidaciomComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidacionRoutingModule {}
