import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaDesembolsoCarteraComponent } from './componentes/consultaDesembolsoCartera.component';

const routes: Routes = [
  { path: '', component: ConsultaDesembolsoCarteraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaDesembolsoCarteraRoutingModule {}
