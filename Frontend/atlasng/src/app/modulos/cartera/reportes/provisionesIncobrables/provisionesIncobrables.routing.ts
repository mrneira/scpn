import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProvisionesIncobrablesComponent } from './componentes/provisionesIncobrables.component';

const routes: Routes = [
  { path: '', component: ProvisionesIncobrablesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvisionesIncobrablesRoutingModule {}
