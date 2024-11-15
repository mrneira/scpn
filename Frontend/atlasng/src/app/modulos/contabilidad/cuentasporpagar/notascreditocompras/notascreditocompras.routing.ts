import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotasCreditoComprasComponent } from './componentes/notascreditocompras.component';

const routes: Routes = [
  { path: '', component: NotasCreditoComprasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotasCreditoComprasRoutingModule {}
