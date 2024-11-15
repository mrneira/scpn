import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovTipoProductoComponent } from './componentes/lov.tipoProducto.component';

const routes: Routes = [
  {
    path: '', component: LovTipoProductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovTipoProductoRoutingModule {}
