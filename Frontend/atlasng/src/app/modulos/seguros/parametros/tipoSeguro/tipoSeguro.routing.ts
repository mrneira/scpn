import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TipoSeguroComponent } from './componentes/tipoSeguro.component';

const routes: Routes = [
  { path: '', component: TipoSeguroComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoSeguroRoutingModule {}
