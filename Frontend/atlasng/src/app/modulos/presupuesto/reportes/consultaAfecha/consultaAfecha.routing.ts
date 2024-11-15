import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaAfechaComponent } from './componentes/consultaAfecha.component';

const routes: Routes = [
  { path: '', component: ConsultaAfechaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaAfechaRoutingModule {}
