import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovDepartamentosComponent } from './componentes/lov.departamentos.component';

const routes: Routes = [
  {
    path: '', component: LovDepartamentosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovDepartamentosRoutingModule {}
