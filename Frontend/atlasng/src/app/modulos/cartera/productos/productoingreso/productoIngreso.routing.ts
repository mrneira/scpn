import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoIngresoComponent } from './componentes/productoIngreso.component';

const routes: Routes = [
  { path: '', component: ProductoIngresoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoIngresoRoutingModule {}
