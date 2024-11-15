import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoVehiculosComponent } from './componentes/mantenimientovehiculos.component';

const routes: Routes = [
  { path: '', component: MantenimientoVehiculosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoVehiculosRoutingModule {}
