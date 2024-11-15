import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TipoProductoComponent } from './componentes/tipoProducto.component';

const routes: Routes = [
  { path: '', component: TipoProductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoProductoRoutingModule {}
