import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivacionComponent } from './componentes/activacion.component';

const routes: Routes = [
  { path: '', component: ActivacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivacionRoutingModule {}
