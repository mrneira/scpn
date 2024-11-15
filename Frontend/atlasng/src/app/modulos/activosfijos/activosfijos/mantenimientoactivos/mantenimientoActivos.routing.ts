import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoActivosComponent } from './componentes/mantenimientoActivos.component';

const routes: Routes = [
  { path: '', component: MantenimientoActivosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoActivosRoutingModule {}
