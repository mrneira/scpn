import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovDevolucionesComponent } from './componentes/lov.devoluciones.component';

const routes: Routes = [
  {
    path: '', component: LovDevolucionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovDevolucionesRoutingModule {}
