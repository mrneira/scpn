import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivarComponent } from './componentes/activar.component';

const routes: Routes = [
  { path: '', component: ActivarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivarRoutingModule {}
