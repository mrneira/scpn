import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargaProductosComponent } from './componentes/cargaproductos.component';

const routes: Routes = [
  { path: '', component: CargaProductosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargaProductosRoutingModule {}
