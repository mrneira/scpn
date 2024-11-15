import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlujoEfectivoComponent } from './componentes/flujoEfectivo.component';

const routes: Routes = [
  { path: '', component: FlujoEfectivoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlujoEfectivoRoutingModule {}
