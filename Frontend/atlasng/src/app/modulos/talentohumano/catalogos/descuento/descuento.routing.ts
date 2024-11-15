import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DescuentoComponent } from './componentes/descuento.component';

const routes: Routes = [
  { path: '', component: DescuentoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DescuentoRoutingModule {}
