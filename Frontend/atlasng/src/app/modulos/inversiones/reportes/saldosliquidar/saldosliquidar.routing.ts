import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaldosliquidarComponent } from './componentes/saldosliquidar.component';

const routes: Routes = [
  { path: '', component: SaldosliquidarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaldosliquidarRoutingModule {}
