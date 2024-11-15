import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoCreditoComponent } from './componentes/tipoCredito.component';

const routes: Routes = [
  { path: '', component: TipoCreditoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoCreditoRoutingModule {}
