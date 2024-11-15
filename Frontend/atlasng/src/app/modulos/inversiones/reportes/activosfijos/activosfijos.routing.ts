import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivosfijosComponent } from './componentes/activosfijos.component';

const routes: Routes = [
  { path: '', component: ActivosfijosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivosfijosRoutingModule {}
