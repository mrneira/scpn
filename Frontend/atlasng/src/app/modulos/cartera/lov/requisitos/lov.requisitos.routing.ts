import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovRequisitosComponent } from './componentes/lov.requisitos.component';

const routes: Routes = [
  {
    path: '', component: LovRequisitosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovRequisitosRoutingModule {}
