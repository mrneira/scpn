import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovProductoComponent } from './componentes/lov.producto.component';

const routes: Routes = [
  {
    path: '', component: LovProductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovProductoRoutingModule {}
