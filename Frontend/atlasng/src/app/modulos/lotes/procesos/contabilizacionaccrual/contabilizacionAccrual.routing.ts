import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContabilizacionAccrualComponent } from './componentes/contabilizacionAccrual.component';

const routes: Routes = [
  { path: '', component: ContabilizacionAccrualComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilizacionAccrualRoutingModule {}
