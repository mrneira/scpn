import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoPolizaComponent } from './componentes/ingresoPoliza.component';

const routes: Routes = [
  {
    path: '', component: IngresoPolizaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoPolizaRoutingModule { }
