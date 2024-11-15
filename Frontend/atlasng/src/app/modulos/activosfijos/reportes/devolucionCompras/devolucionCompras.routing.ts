import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevolucionComprasComponent } from './componentes/devolucionCompras.component';

const routes: Routes = [
  { path: '', component: DevolucionComprasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevolucionComprasRoutingModule {}
