import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentasporpagarComponent } from './componentes/cuentasporpagar.component';

const routes: Routes = [
  { path: '', component: CuentasporpagarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuentasporpagarRoutingModule {}
