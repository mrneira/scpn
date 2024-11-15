import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CedulaPresupuestariaGastoConsultaComponent } from './componentes/cedulaPresupuestariaGastoConsulta.component';

const routes: Routes = [
  { path: '', component: CedulaPresupuestariaGastoConsultaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CedulaPresupuestariaGastoConsultaRoutingModule {}
