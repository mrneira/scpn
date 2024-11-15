import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RangosProductoComponent } from './componentes/rangosProducto.component';

const routes: Routes = [
  { path: '', component: RangosProductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RangosProductoRoutingModule {}
