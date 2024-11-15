import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaIngresoComponent } from './componentes/consultaingreso.component';

const routes: Routes = [
  { path: '', component: ConsultaIngresoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaIngresoRoutingModule {}
