import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CorreccionComprobanteComponent } from './componentes/correccioncomprobante.component';

const routes: Routes = [
  { path: '', component: CorreccionComprobanteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorreccionComprobanteRoutingModule {}
