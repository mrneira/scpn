import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CapacidadGaranteComponent } from './componentes/_capacidadGarante.component';

const routes: Routes = [
  {
    path: '', component: CapacidadGaranteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapacidadGaranteRoutingModule { }
