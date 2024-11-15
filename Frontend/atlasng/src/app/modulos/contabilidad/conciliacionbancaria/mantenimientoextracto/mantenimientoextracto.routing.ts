import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MantenimientoextractoComponent } from './componentes/mantenimientoextracto.component';

const routes: Routes = [
  { path: '', component: MantenimientoextractoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MantenimientoextractoRoutingModule {}
