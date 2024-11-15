import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovOperadorinstComponent } from './componentes/lov.operadorinst.component';

const routes: Routes = [
  {
    path: '', component: LovOperadorinstComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovOperadorinstRoutingModule {}