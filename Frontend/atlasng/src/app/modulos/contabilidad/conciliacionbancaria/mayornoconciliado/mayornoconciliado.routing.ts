import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MayornoconciliadoComponent } from './componentes/mayornoconciliado.component';

const routes: Routes = [
  { path: '', component: MayornoconciliadoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MayornoconciliadoRoutingModule {}
