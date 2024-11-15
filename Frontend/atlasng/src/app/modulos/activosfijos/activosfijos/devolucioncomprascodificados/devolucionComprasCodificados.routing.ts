import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DevolucionComprasCodificadosComponent } from './componentes/devolucionComprasCodificados.component';

const routes: Routes = [
  { path: '', component: DevolucionComprasCodificadosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevolucionComprasCodificadosRoutingModule {}
