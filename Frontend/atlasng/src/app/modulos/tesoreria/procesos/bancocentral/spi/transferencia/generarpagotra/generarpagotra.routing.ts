import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarPagoTraComponent } from './componentes/generarpagotra.component';

const routes: Routes = [
  { path: '', component: GenerarPagoTraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarPagoTraRoutingModule {}
