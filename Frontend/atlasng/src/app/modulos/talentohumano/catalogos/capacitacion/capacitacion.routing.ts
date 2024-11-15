import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapacitacionComponent } from './componentes/capacitacion.component';

const routes: Routes = [
  { path: '', component: CapacitacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapacitacionRoutingModule {}
