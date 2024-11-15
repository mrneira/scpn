import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovEstablecimientoComponent } from './componentes/lov.establecimiento.component';

const routes: Routes = [
  {
    path: '', component: LovEstablecimientoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovEstablecimientoRoutingModule {}
