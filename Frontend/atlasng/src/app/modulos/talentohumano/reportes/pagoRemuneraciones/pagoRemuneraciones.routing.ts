import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagoRemuneracionesComponent } from './componentes/pagoRemuneraciones.component';

const routes: Routes = [
  { path: '', component: PagoRemuneracionesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagoRemuneracionesRoutingModule {}
