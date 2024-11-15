import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovTipoBajaComponent } from './componentes/lov.tipoBaja.component';

const routes: Routes = [
  {
    path: '', component: LovTipoBajaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovTipoBajaRoutingModule {}
