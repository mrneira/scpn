import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {SeguroProductoComponent } from './componentes/seguroProducto.component';

const routes: Routes = [
  { path: '', component: SeguroProductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeguroProductoRoutingModule {}
