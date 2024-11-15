import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArregloPagosComponent } from './componentes/arregloPagos.component';

const routes: Routes = [
  { path: '', component: ArregloPagosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArregloPagosRoutingModule {}
