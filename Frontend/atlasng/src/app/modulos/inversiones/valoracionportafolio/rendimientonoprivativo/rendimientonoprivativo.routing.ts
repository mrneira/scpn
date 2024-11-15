import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RendimientonoprivativoComponent } from './componentes/rendimientonoprivativo.component';

const routes: Routes = [
  { path: '', component: RendimientonoprivativoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RendimientonoprivativoRoutingModule {}
