import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FondoliquidezComponent } from './componentes/fondoliquidez.component';

const routes: Routes = [
  { path: '', component: FondoliquidezComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FondoLiquidezRoutingModule {}
