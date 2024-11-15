import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilContableProductoComponent } from './componentes/perfilContableProducto.component';

const routes: Routes = [
  { path: '', component: PerfilContableProductoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilContableProductoRoutingModule {}
