import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RendimientorentavariableComponent } from './componentes/rendimientorentavariable.component';

const routes: Routes = [
  { path: '', component: RendimientorentavariableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RendimientorentavariableRoutingModule {}
