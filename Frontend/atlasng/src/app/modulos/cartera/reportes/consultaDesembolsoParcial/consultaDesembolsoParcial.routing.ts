import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaDesembolsoParcialComponent } from './componentes/consultaDesembolsoParcial.component';

const routes: Routes = [
  { path: '', component: ConsultaDesembolsoParcialComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaDesembolsoParcialRoutingModule {}
