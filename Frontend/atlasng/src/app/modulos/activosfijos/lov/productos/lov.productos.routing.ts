import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovProductosComponent } from './componentes/lov.productos.component';

const routes: Routes = [
  {
    path: '', component: LovProductosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovProductosRoutingModule {}
