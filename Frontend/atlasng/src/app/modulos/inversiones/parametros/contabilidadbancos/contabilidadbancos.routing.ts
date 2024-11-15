import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContabilidadbancosComponent } from './componentes/contabilidadbancos.component';

const routes: Routes = [
  { path: '', component: ContabilidadbancosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContabilidadbancosRoutingModule {}
