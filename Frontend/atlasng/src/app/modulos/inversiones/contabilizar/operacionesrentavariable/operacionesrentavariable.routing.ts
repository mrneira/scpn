import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperacionesrentavariableComponent } from './componentes/operacionesrentavariable.component';

const routes: Routes = [
  { path: '', component: OperacionesrentavariableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionesrentavariableRoutingModule {}
