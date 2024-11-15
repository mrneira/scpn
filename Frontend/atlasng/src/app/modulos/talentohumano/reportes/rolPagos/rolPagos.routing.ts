import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolPagosComponent } from './componentes/rolPagos.component';

const routes: Routes = [
  { path: '', component: RolPagosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolPagosRoutingModule {}
