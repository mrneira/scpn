import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolpagoComponent } from './componentes/rolpago.component';

const routes: Routes = [
  { path: '', component: RolpagoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolpagoRoutingModule {}
