import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaEgresoComponent } from './componentes/consultaegreso.component';

const routes: Routes = [
  { path: '', component: ConsultaEgresoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaEgresoRoutingModule {}
