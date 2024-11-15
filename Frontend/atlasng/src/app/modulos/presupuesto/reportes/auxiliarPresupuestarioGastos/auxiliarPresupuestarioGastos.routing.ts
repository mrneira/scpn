import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuxiliarPresupuestarioGastosComponent } from './componentes/auxiliarPresupuestarioGastos.component';

const routes: Routes = [
  { path: '', component: AuxiliarPresupuestarioGastosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuxiliarPresupuestarioGastosRoutingModule {}
