import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaEntregasComponent } from './componentes/consultaEntregas.component';


const routes: Routes = [
  { path: '', component: ConsultaEntregasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaEntregasRoutingModule {}
