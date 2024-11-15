import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaIngresosCodificadosComponent } from './componentes/consultaingresoscodificados.component';

const routes: Routes = [
  { path: '', component: ConsultaIngresosCodificadosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaIngresosCodificadosRoutingModule {}
