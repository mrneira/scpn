import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCapacitacionComponent } from './componentes/lov.capacitacion.component';

const routes: Routes = [
  {
    path: '', component: LovCapacitacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCapacitacionRoutingModule {}
