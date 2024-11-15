import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresoGastosComponent } from './componentes/ingresoGastos.component';

const routes: Routes = [
  { path: '', component: IngresoGastosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresoGastosRoutingModule {}
