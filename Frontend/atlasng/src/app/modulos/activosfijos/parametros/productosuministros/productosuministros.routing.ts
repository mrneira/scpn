import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductoSuministrosComponent } from './componentes/productosuministros.component';

const routes: Routes = [
  { path: '', component: ProductoSuministrosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductoSuministrosRoutingModule {}
