import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanCuentasComponent } from './componentes/planCuentas.component';

const routes: Routes = [
  { path: '', component: PlanCuentasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanCuentasRoutingModule {}
