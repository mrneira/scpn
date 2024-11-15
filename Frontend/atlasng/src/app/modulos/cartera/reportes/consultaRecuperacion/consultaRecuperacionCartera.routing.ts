import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaRecuperacionCarteraComponent } from './componentes/consultaRecuperacionCartera.component';

const routes: Routes = [
  { path: '', component: ConsultaRecuperacionCarteraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaRecuperacionCarteraRoutingModule {}
