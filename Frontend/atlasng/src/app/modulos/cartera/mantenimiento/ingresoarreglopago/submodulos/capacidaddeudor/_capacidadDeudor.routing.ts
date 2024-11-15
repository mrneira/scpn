import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapacidadDeudorComponent } from './componentes/_capacidadDeudor.component';

const routes: Routes = [
  {
    path: '', component: CapacidadDeudorComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapacidadDeudorRoutingModule { }
