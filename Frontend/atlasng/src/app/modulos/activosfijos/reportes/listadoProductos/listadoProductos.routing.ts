import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoProductosComponent } from './componentes/listadoProductos.component';

const routes: Routes = [
  { path: '', component: ListadoProductosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListadoProductosRoutingModule {}
