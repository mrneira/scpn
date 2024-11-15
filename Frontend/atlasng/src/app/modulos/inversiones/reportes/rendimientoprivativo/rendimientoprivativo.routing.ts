import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RendimientoprivativoComponent } from './componentes/rendimientoprivativo.component';

const routes: Routes = [
  { path: '', component: RendimientoprivativoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RendimientoprivativoRoutingModule {}
