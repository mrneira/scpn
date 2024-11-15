import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapacitacionDetalleComponent } from './componentes/capacitaciondet.component';

const routes: Routes = [
  { path: '', component: CapacitacionDetalleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapacitacionDetalleRoutingModule {}
