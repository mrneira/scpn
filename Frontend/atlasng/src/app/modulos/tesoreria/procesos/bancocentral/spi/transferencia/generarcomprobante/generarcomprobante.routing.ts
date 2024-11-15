import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerarComprobanteComponent } from './componentes/generarcomprobante.component';

const routes: Routes = [
  { path: '', component: GenerarComprobanteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarComprobanteRoutingModule {}
