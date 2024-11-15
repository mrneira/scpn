import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtractonoconciliadoComponent } from './componentes/extractonoconciliado.component';

const routes: Routes = [
  { path: '', component: ExtractonoconciliadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtractonoconciliadoRoutingModule {}
