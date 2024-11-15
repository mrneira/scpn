import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCuentasContablesComponent } from './componentes/lov.cuentasContables.component';

const routes: Routes = [
  {
    path: '', component: LovCuentasContablesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCuentasContablesRoutingModule {}
