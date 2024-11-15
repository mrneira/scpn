import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComprobanteComponent } from './componentes/_comprobante.component';

const routes: Routes = [
  { path: '', component: ComprobanteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprobanteRoutingModule {}
