import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodigosConsultaComponent } from './componentes/codigosConsulta.component';

const routes: Routes = [
  { path: '', component: CodigosConsultaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CodigosConsultaRoutingModule {}
