import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaGarantiaComponent } from './componentes/consultaGarantia.component';

const routes: Routes = [
  { path: '', component: ConsultaGarantiaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaGarantiaRoutingModule {}
