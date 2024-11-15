import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OficioscompraComponent } from './componentes/oficioscompra.component';

const routes: Routes = [
  { path: '', component: OficioscompraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OficioscompraRoutingModule {}
