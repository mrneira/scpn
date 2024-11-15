import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresosCapacidadComponent } from './componentes/_ingresosCapacidad.component';

const routes: Routes = [
  {
    path: '', component: IngresosCapacidadComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresosCapacidadRoutingModule { }
