import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaCobranzaComponent } from './componentes/consultaCobranza.component';

const routes: Routes = [
  { path: '', component: ConsultaCobranzaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaCobranzaRoutingModule {}
