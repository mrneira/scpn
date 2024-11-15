import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaLiquidacionMoraComponent } from './componentes/consultaLiquidacionMora.component';

const routes: Routes = [
  { path: '', component: ConsultaLiquidacionMoraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaLiquidacionMoraRoutingModule {}
