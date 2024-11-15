import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovDescuentoComponent } from './componentes/lov.descuento.component';

const routes: Routes = [
  {
    path: '', component: LovDescuentoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovDescuentoRoutingModule {}
