import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaEjecucionComponent } from './componentes/consultaEjecucion.component';

const routes: Routes = [
  { path: '', component: ConsultaEjecucionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaEjecucionRoutingModule {}
