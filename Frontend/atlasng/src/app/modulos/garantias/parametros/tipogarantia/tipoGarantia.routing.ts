import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoGarantiaComponent } from './componentes/tipoGarantia.component';

const routes: Routes = [
  { path: '', component: TipoGarantiaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoGarantiaRoutingModule {}
