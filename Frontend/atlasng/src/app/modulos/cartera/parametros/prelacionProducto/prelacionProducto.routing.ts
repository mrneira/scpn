import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrelacionProductoComponent } from './componentes/prelacionProducto.component';

const routes: Routes = [
  { path: '', component: PrelacionProductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrelacionProductoRoutingModule {}
