import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCodigosConsultaComponent } from './componentes/lov.codigosConsulta.component';

const routes: Routes = [
  {
    path: '', component: LovCodigosConsultaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCodigosConsultaRoutingModule {}
