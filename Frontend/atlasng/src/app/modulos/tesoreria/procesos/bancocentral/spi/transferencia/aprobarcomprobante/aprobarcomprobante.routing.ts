import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AprobarComprobanteComponent } from './componentes/aprobarcomprobante.component';

const routes: Routes = [
  { path: '', component: AprobarComprobanteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprobarComprobanteRoutingModule {}
