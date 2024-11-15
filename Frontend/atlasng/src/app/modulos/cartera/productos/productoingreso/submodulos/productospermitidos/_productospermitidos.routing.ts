import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductosPermitidosComponent } from './componentes/_productospermitidos.component';

const routes: Routes = [
  { path: '', component: ProductosPermitidosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosPermitidosRoutingModule {}
