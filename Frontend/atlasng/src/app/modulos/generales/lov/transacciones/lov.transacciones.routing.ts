import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovTransaccionesComponent } from './componentes/lov.transacciones.component';

const routes: Routes = [
  {
    path: '', component: LovTransaccionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovTransaccionesRoutingModule {}
