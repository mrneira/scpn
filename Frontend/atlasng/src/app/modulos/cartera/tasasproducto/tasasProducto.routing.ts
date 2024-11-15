import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TasasProductoComponent } from './componentes/tasasProducto.component';

const routes: Routes = [
  { path: '', component: TasasProductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasasProductoRoutingModule {}
