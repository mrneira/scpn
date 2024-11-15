import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCuentasPorCobrarComponent } from './componentes/lov.cuentasporcobrarcomponent';

const routes: Routes = [
  {
    path: '', component: LovCuentasPorCobrarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCuentasPorCobrarRoutingModule {}