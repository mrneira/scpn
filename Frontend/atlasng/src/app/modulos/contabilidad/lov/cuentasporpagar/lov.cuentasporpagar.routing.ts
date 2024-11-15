import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCuentasporpagarComponent } from './componentes/lov.cuentasporpagar.component';

const routes: Routes = [
  {
    path: '', component: LovCuentasporpagarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCuentasporpagarRoutingModule {}
