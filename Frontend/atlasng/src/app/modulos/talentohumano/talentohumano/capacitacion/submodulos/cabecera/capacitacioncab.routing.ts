import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapacitacionEventoComponent } from './componentes/capacitacioncab.component';

const routes: Routes = [
  { path: '', component: CapacitacionEventoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapacitacionEventoRoutingModule {}
