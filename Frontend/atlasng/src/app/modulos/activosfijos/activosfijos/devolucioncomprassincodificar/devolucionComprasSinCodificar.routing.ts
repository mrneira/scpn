import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevolucionComprasSinCodificarComponent } from './componentes/devolucionComprasSinCodificar.component';

const routes: Routes = [
  { path: '', component: DevolucionComprasSinCodificarComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevolucionComprasSinCodificarRoutingModule {}
