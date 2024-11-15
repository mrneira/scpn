import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiesgotituloComponent } from './componentes/riesgotitulo.component';

const routes: Routes = [
  { path: '', component: RiesgotituloComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiesgotituloRoutingModule {}
