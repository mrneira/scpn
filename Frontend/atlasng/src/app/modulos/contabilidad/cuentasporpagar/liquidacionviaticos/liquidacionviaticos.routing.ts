import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LiquidacionViaticosComponent } from './componentes/liquidacionviaticos.component';

const routes: Routes = [
  { path: '', component: LiquidacionViaticosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidacionViaticosRoutingModule {}
