import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoVectorPreciosComponent } from './componentes/mantenimientovectorprecios.component';

const routes: Routes = [
  { path: '', component: MantenimientoVectorPreciosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoVectorPreciosRoutingModule {}
